import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface PaymentProps {
  subscriptionId?: UniqueEntityID | null
  advertisementId?: UniqueEntityID | null
  gateway?: string | null
  checkoutId?: string | null
  amount: number
  tax?: number | null
  status: string
  link?: string | null
  method?: string | null
  pixData?: string | null
  finalCard?: string | null
  confirmationDate?: Date | null
  expiresAt: Date
  createdAt: Date
  updatedAt?: Date | null
}

export class Payment extends Entity<PaymentProps> {
  get subscriptionId() {
    return this.props.subscriptionId
  }

  set subscriptionId(subscriptionId: UniqueEntityID | null | undefined) {
    this.props.subscriptionId = subscriptionId
    this.touch()
  }

  get advertisementId() {
    return this.props.advertisementId
  }

  set advertisementId(advertisementId: UniqueEntityID | null | undefined) {
    this.props.advertisementId = advertisementId
    this.touch()
  }

  get gateway() {
    return this.props.gateway
  }

  set gateway(gateway: string | null | undefined) {
    this.props.gateway = gateway
    this.touch()
  }

  get checkoutId() {
    return this.props.checkoutId
  }

  set checkoutId(checkoutId: string | null | undefined) {
    this.props.checkoutId = checkoutId
    this.touch()
  }

  get amount() {
    return this.props.amount
  }

  set amount(amount: number) {
    this.props.amount = amount
    this.touch()
  }

  get tax() {
    return this.props.tax
  }

  set tax(tax: number | null | undefined) {
    this.props.tax = tax
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  get link() {
    return this.props.link
  }

  set link(link: string | null | undefined) {
    this.props.link = link
    this.touch()
  }

  get method() {
    return this.props.method
  }

  set method(method: string | null | undefined) {
    this.props.method = method
    this.touch()
  }

  get pixData() {
    return this.props.pixData
  }

  set pixData(pixData: string | null | undefined) {
    this.props.pixData = pixData
    this.touch()
  }

  get finalCard() {
    return this.props.finalCard
  }

  set finalCard(finalCard: string | null | undefined) {
    this.props.finalCard = finalCard
    this.touch()
  }

  get confirmationDate() {
    return this.props.confirmationDate
  }

  set confirmationDate(confirmationDate: Date | null | undefined) {
    this.props.confirmationDate = confirmationDate
    this.touch()
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  set expiresAt(expiresAt: Date) {
    this.props.expiresAt = expiresAt
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      PaymentProps,
      | 'subscriptionId'
      | 'advertisementId'
      | 'gateway'
      | 'checkoutId'
      | 'tax'
      | 'link'
      | 'method'
      | 'pixData'
      | 'finalCard'
      | 'confirmationDate'
      | 'updatedAt'
      | 'createdAt'
    >,
    id?: UniqueEntityID,
  ) {
    const payment = new Payment(
      {
        ...props,
        subscriptionId: props.subscriptionId ?? null,
        advertisementId: props.advertisementId ?? null,
        gateway: props.gateway ?? null,
        checkoutId: props.checkoutId ?? null,
        tax: props.tax ?? null,
        link: props.link ?? null,
        method: props.method ?? null,
        pixData: props.pixData ?? null,
        finalCard: props.finalCard ?? null,
        confirmationDate: props.confirmationDate ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
      },
      id,
    )

    return payment
  }
}
