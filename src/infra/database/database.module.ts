import { Module } from '@nestjs/common'

import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { IdentitiesRolesRepository } from '@/domain/identity-access/application/repositories/identities-roles-repository'
import { RolesPermissionsRepository } from '@/domain/identity-access/application/repositories/roles-permissions-repository'
import { RolesRepository } from '@/domain/identity-access/application/repositories/roles-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { AddressesRepository } from '@/domain/ondehoje/application/modules/address/repositories/addresses-repository'
import { AdvertisementsRepository } from '@/domain/ondehoje/application/modules/advertisement/repositories/advertisements-repository'
import { AdvertisementAuthorizationsRepository } from '@/domain/ondehoje/application/modules/advertisement-authorization/repositories/advertisement-authorizations-repository'
import { CategoriesRepository } from '@/domain/ondehoje/application/modules/category/repositories/categories-repository'
import { ClientsRepository } from '@/domain/ondehoje/application/modules/client/repositories/clients-repository'
import { CompaniesRepository } from '@/domain/ondehoje/application/modules/company/repositories/companies-repository'
import { CompanyDocumentsRepository } from '@/domain/ondehoje/application/modules/company-document/repositories/company-documents-repository'
import { CompanyImagesRepository } from '@/domain/ondehoje/application/modules/company-image/repositories/company-images-repository'
import { CouponsRepository } from '@/domain/ondehoje/application/modules/coupon/repositories/coupons-repository'
import { DocumentsRepository } from '@/domain/ondehoje/application/modules/document/repositories/documents-repository'
import { DocumentTypesRepository } from '@/domain/ondehoje/application/modules/document-type/repositories/document-types-repository'
import { EventsRepository } from '@/domain/ondehoje/application/modules/event/repositories/events-repository'
import { EventImagesRepository } from '@/domain/ondehoje/application/modules/event-image/repositories/event-images-repository'
import { FavoritesRepository } from '@/domain/ondehoje/application/modules/favorite/repositories/favorites-repository'
import { ImagesRepository } from '@/domain/ondehoje/application/modules/image/repositories/images-repository'
import { InformationsRepository } from '@/domain/ondehoje/application/modules/information/repositories/informations-repository'
import { ParametersRepository } from '@/domain/ondehoje/application/modules/parameter/repositories/parameters-repository'
import { SubscriptionsHistRepository } from '@/domain/ondehoje/application/modules/subscription/modules/hist/repositories/subscriptions-hist-repository'
import { SubscriptionsRepository } from '@/domain/ondehoje/application/modules/subscription/repositories/subscriptions-repository'
import { UsersRepository } from '@/domain/ondehoje/application/modules/user/repositories/users-repository'
import { UserCouponsRepository } from '@/domain/ondehoje/application/modules/user-coupon/repositories/user-coupons-repository'
import { UserImagesRepository } from '@/domain/ondehoje/application/modules/user-image/repositories/user-images-repository'
import { PaymentsRepository } from '@/domain/payment/application/repositories/payments-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository'
import { PrismaAdvertisementAuthorizationsRepository } from './prisma/repositories/prisma-advertisement-authorizations-repository'
import { PrismaAdvertisementsRepository } from './prisma/repositories/prisma-advertisements-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'
import { PrismaClientsRepository } from './prisma/repositories/prisma-clients-repository'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository'
import { PrismaCompanyDocumentsRepository } from './prisma/repositories/prisma-company-documents-repository'
import { PrismaCompanyImagesRepository } from './prisma/repositories/prisma-company-images-repository'
import { PrismaCouponsRepository } from './prisma/repositories/prisma-coupons-repository'
import { PrismaDocumentTypesRepository } from './prisma/repositories/prisma-document-types-repository'
import { PrismaDocumentsRepository } from './prisma/repositories/prisma-documents-repository'
import { PrismaEventImagesRepository } from './prisma/repositories/prisma-event-images-repository'
import { PrismaEventsRepository } from './prisma/repositories/prisma-events-repository'
import { PrismaFavoritesRepository } from './prisma/repositories/prisma-favorites-repository'
import { PrismaIdentitiesRepository } from './prisma/repositories/prisma-identities-repository'
import { PrismaIdentitiesRolesRepository } from './prisma/repositories/prisma-identities-roles-repository'
import { PrismaImagesRepository } from './prisma/repositories/prisma-images-repository'
import { PrismaInformationsRepository } from './prisma/repositories/prisma-informations-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaParametersRepository } from './prisma/repositories/prisma-parameters-repository'
import { PrismaPaymentsRepository } from './prisma/repositories/prisma-payments-repository'
import { PrismaRolesPermissionsRepository } from './prisma/repositories/prisma-roles-permissions-repository'
import { PrismaRolesRepository } from './prisma/repositories/prisma-roles-repository'
import { PrismaSubscriptionsHistRepository } from './prisma/repositories/prisma-subscriptions-hist-repository'
import { PrismaSubscriptionsRepository } from './prisma/repositories/prisma-subscriptions-repository'
import { PrismaUserCouponsRepository } from './prisma/repositories/prisma-user-coupons-repository'
import { PrismaUserImagesRepository } from './prisma/repositories/prisma-user-images-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
    {
      provide: DocumentTypesRepository,
      useClass: PrismaDocumentTypesRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: CompanyDocumentsRepository,
      useClass: PrismaCompanyDocumentsRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: EventsRepository,
      useClass: PrismaEventsRepository,
    },
    {
      provide: InformationsRepository,
      useClass: PrismaInformationsRepository,
    },
    {
      provide: ImagesRepository,
      useClass: PrismaImagesRepository,
    },
    {
      provide: EventImagesRepository,
      useClass: PrismaEventImagesRepository,
    },
    {
      provide: CompanyImagesRepository,
      useClass: PrismaCompanyImagesRepository,
    },
    {
      provide: UserImagesRepository,
      useClass: PrismaUserImagesRepository,
    },
    {
      provide: SubscriptionsRepository,
      useClass: PrismaSubscriptionsRepository,
    },
    {
      provide: SubscriptionsHistRepository,
      useClass: PrismaSubscriptionsHistRepository,
    },
    {
      provide: FavoritesRepository,
      useClass: PrismaFavoritesRepository,
    },
    {
      provide: ParametersRepository,
      useClass: PrismaParametersRepository,
    },
    {
      provide: AdvertisementsRepository,
      useClass: PrismaAdvertisementsRepository,
    },
    {
      provide: AdvertisementAuthorizationsRepository,
      useClass: PrismaAdvertisementAuthorizationsRepository,
    },
    {
      provide: IdentitiesRepository,
      useClass: PrismaIdentitiesRepository,
    },
    {
      provide: IdentitiesRolesRepository,
      useClass: PrismaIdentitiesRolesRepository,
    },
    {
      provide: RolesRepository,
      useClass: PrismaRolesRepository,
    },
    {
      provide: RolesPermissionsRepository,
      useClass: PrismaRolesPermissionsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
    {
      provide: DocumentsRepository,
      useClass: PrismaDocumentsRepository,
    },
    {
      provide: CouponsRepository,
      useClass: PrismaCouponsRepository,
    },
    {
      provide: UserCouponsRepository,
      useClass: PrismaUserCouponsRepository,
    },
  ],
  exports: [
    PrismaService,
    ClientsRepository,
    UsersRepository,
    AddressesRepository,
    CompaniesRepository,
    CompanyDocumentsRepository,
    DocumentTypesRepository,
    CategoriesRepository,
    EventsRepository,
    InformationsRepository,
    ImagesRepository,
    EventImagesRepository,
    CompanyImagesRepository,
    UserImagesRepository,
    SubscriptionsRepository,
    SubscriptionsHistRepository,
    FavoritesRepository,
    ParametersRepository,
    AdvertisementsRepository,
    AdvertisementAuthorizationsRepository,
    IdentitiesRepository,
    IdentitiesRolesRepository,
    RolesRepository,
    NotificationsRepository,
    PaymentsRepository,
    DocumentsRepository,
    CouponsRepository,
    UserCouponsRepository,
  ],
})
export class DatabaseModule {}
