import { faker } from '@faker-js/faker'

import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserCouponProps {
  couponId: UniqueEntityID
  userId: UniqueEntityID
  hash: string
  usedAt: Date | null
  createdAt: Date
}

export class UserCoupon extends Entity<UserCouponProps> {
  get couponId() {
    return this.props.couponId
  }

  set couponId(couponId: UniqueEntityID) {
    this.props.couponId = couponId
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
  }

  get hash() {
    return this.props.hash
  }

  set hash(hash: string) {
    this.props.hash = hash
  }

  get usedAt() {
    return this.props.usedAt
  }

  set usedAt(usedAt: Date | null) {
    this.props.usedAt = usedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<UserCouponProps, 'createdAt' | 'hash' | 'usedAt'>,
    id?: UniqueEntityID,
  ) {
    const userCoupon = new UserCoupon(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        hash: props.hash ?? faker.string.alphanumeric(8).toUpperCase(),
        usedAt: props.usedAt ?? null,
      },
      id,
    )

    return userCoupon
  }
}
