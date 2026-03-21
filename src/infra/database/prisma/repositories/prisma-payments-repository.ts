import { Injectable } from '@nestjs/common'

import { PaymentsRepository } from '@/domain/payment/application/repositories/payments-repository'
import type { Payment } from '@/domain/payment/enterprise/entities/payment'
import type { PaymentDetails } from '@/domain/payment/enterprise/entities/value-objects/payment-details'

import { PrismaPaymentDetailsMapper } from '../mappers/prisma-payment-details-mapper'
import { PrismaPaymentMapper } from '../mappers/prisma-payment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Payment | null> {
    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!payment) {
      return null
    }

    return PrismaPaymentMapper.toDomain(payment)
  }

  async findByGatewayAndCheckoutId(
    gateway: Payment['gateway'],
    checkoutId: Payment['checkoutId'],
  ): Promise<Payment | null> {
    if (!gateway || !checkoutId) {
      return null
    }

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.findUnique({
        where: {
          gateway_checkoutId: {
            gateway,
            checkoutId,
          },
        },
      }),
    ])

    if (!payment) {
      return null
    }

    return PrismaPaymentMapper.toDomain(payment)
  }

  async findFirstByCheckoutId(
    checkoutId: Payment['checkoutId'],
  ): Promise<PaymentDetails | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        checkoutId,
      },
      include: {
        advertisement: {
          include: {
            company: true,
            event: true,
            advertisementAuthorizations: true,
          },
        },
        subscription: true,
      },
    })

    if (!payment) {
      return null
    }

    return PrismaPaymentDetailsMapper.toDomain(payment)
  }

  async findManyBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    const [payments] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where: {
          subscriptionId,
        },
      }),
    ])

    return payments.map(PrismaPaymentMapper.toDomain)
  }

  async findManyByAdvertisementId(advertisementId: string): Promise<Payment[]> {
    const [payments] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where: {
          advertisementId,
        },
      }),
    ])

    return payments.map(PrismaPaymentMapper.toDomain)
  }

  async create(payment: Payment): Promise<void> {
    const data = PrismaPaymentMapper.toPersistency(payment)

    await this.prisma.$transaction([
      this.prisma.payment.create({
        data,
      }),
    ])
  }

  async save(payment: Payment): Promise<void> {
    const data = PrismaPaymentMapper.toPersistency(payment)

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: {
          id: payment.id.toString(),
        },
        data,
      }),
    ])
  }
}
