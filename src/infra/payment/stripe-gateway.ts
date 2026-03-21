import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import {
  CheckoutResponse,
  PaymentGateway,
} from '@/domain/payment/application/gateways/payment-gateway'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { EnvService } from '../env/env.service'

@Injectable()
export class StripeGateway implements PaymentGateway {
  private stripe: Stripe
  private PAYMENT_GATEWAY_SUCCESS_URL: string = ''
  private PAYMENT_GATEWAY_CANCEL_URL: string = ''

  constructor(private env: EnvService) {
    this.stripe = new Stripe(this.env.get('STRIPE_API_KEY'), {
      apiVersion: '2025-10-29.clover',
    })

    this.PAYMENT_GATEWAY_SUCCESS_URL = this.env.get(
      'PAYMENT_GATEWAY_SUCCESS_URL',
    )
    this.PAYMENT_GATEWAY_CANCEL_URL = this.env.get('PAYMENT_GATEWAY_CANCEL_URL')
  }

  async checkout(payment: Payment): Promise<CheckoutResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Pagamento de anúncio',
              },
              unit_amount: payment.amount,
            },
            quantity: 1,
          },
        ],
        success_url: this.PAYMENT_GATEWAY_SUCCESS_URL,
        cancel_url: this.PAYMENT_GATEWAY_CANCEL_URL,
        mode: 'payment',
        payment_intent_data: {
          metadata: {
            paymentId: payment.id.toString(),
          },
        },
        metadata: {
          paymentId: payment.id.toString(),
        },
      })

      return {
        gateway: PaymentProvider.STRIPE,
        checkoutId: session.id,
        tax: 0,
        link: session.url,
      }
    } catch (error) {
      console.error('Error creating Stripe payment link:', error)
      throw error
    }
  }
}
