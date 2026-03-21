import { Decimal } from '@prisma/client/runtime/library'

import type { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'
import type { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'

export interface SeedCompany {
  name: string
  slug: string
  socialName: string
  document: string
  status: CompanyStatus
}

export interface SeedAddress {
  street: string
  neighborhood: string
  number: string
  cep: string
  city: string
  state: string
  latitude: number | Decimal
  longitude: number | Decimal
}

export interface SeedSubscription {
  amount: number
  daysDuration: number
  status: SubscriptionStatus
}

export interface SeedImage {
  url: string
  alt: string
}

export interface SeedAdvertisement {
  description: string
  amount: number
  days: number
  expirationDate: Date
  paymentLink: string
  paymentCheckoutId: string
}

export interface SeedCoupon {
  name: string
  description: string
}

export interface SeedInformation {
  name: string
  email?: string | null
  phoneNumber?: string | null
  description?: string | null
}

export interface SeedEvent {
  name: string
  slug: string
  categoryName: string
  description: string
  image: SeedImage
  startDate: Date
  endDate: Date
  specificAddress?: SeedAddress
  coupons: SeedCoupon[]
  advertisement: SeedAdvertisement
  contacts: SeedInformation[]
}

export interface SeedCompanyItem {
  company: SeedCompany
  address: SeedAddress
  subscription: SeedSubscription
  advertisement?: SeedAdvertisement
  contacts: SeedInformation[]
  images: SeedImage[]
  events: SeedEvent[]
}
