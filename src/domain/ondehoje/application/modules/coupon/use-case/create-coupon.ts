import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'

import { EventsRepository } from '../../event/repositories/events-repository'
import { CouponsRepository } from '../repositories/coupons-repository'

interface CreateCouponUseCaseRequest {
  eventId: string
  name: Coupon['name']
  description: Coupon['description']
  expiresAt: Coupon['expiresAt']
  createdBy: string
}

type CreateCouponUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class CreateCouponUseCase {
  constructor(
    private couponsRepository: CouponsRepository,
    private eventsRepository: EventsRepository,
  ) {}

  async execute({
    eventId,
    name,
    description,
    expiresAt,
    createdBy,
  }: CreateCouponUseCaseRequest): Promise<CreateCouponUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    const coupon = Coupon.create({
      eventId: event.id,
      name,
      description,
      expiresAt,
      createdBy: new UniqueEntityID(createdBy),
    })

    await this.couponsRepository.create(coupon)

    return success({
      coupon,
    })
  }
}
