import { ValueObject } from '@/core/entities/value-object'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { Payment } from '../payment'

export interface PaymentDetailsProps {
  id: Payment['id']
  gateway: Payment['gateway']
  checkoutId: Payment['checkoutId']
  amount: Payment['amount']
  tax: Payment['tax']
  status: Payment['status']
  link: Payment['link']
  method: Payment['method']
  pixData: Payment['pixData']
  finalCard: Payment['finalCard']
  confirmationDate: Payment['confirmationDate']
  expiresAt: Payment['expiresAt']
  createdAt: Payment['createdAt']
  updatedAt: Payment['updatedAt']
  subscription: Subscription | null
  advertisement: AdvertisementDetails | null
}

export class PaymentDetails extends ValueObject<PaymentDetailsProps> {
  get id() {
    return this.props.id
  }

  get gateway() {
    return this.props.gateway
  }

  get checkoutId() {
    return this.props.checkoutId
  }

  get amount() {
    return this.props.amount
  }

  get tax() {
    return this.props.tax
  }

  get status() {
    return this.props.status
  }

  get link() {
    return this.props.link
  }

  get method() {
    return this.props.method
  }

  get pixData() {
    return this.props.pixData
  }

  get finalCard() {
    return this.props.finalCard
  }

  get confirmationDate() {
    return this.props.confirmationDate
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get subscription() {
    return this.props.subscription
  }

  get advertisement() {
    return this.props.advertisement
  }

  static create(props: PaymentDetailsProps) {
    return new PaymentDetails(props)
  }
}
