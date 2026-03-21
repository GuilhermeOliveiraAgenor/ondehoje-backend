import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

import { GetMeUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/get-me'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { HttpAddressModule } from './controllers/address/address.module'
import { HttpAdvertisementModule } from './controllers/advertisement/advertisement.module'
import { HttpCategoryModule } from './controllers/category/category.module'
import { GetMeController } from './controllers/client/routes/get-me.controller'
import { HttpCompanyModule } from './controllers/company/company.module'
import { HttpCouponModule } from './controllers/coupon/coupon.module'
import { HttpDocumentTypeModule } from './controllers/document-type/document-type.module'
import { HttpEventModule } from './controllers/event/event.module'
import { HttpFavoriteModule } from './controllers/favorite/favorite.module'
import { HttpIdentityAccessModule } from './controllers/identity-access/identity-access.module'
import { HttpInformationModule } from './controllers/information/information.module'
import { HttpParameterModule } from './controllers/parameter/parameter.module'
import { HttpPaymentModule } from './controllers/payment/payment.module'
import { HttpSubscriptionModule } from './controllers/subscription/subscription.module'
import { HttpUploadModule } from './controllers/upload/upload.module'
import { HttpUserCouponModule } from './controllers/user-coupon/user-coupon.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    HttpCompanyModule,
    HttpCategoryModule,
    HttpAddressModule,
    HttpDocumentTypeModule,
    HttpEventModule,
    HttpInformationModule,
    HttpIdentityAccessModule,
    HttpAdvertisementModule,
    HttpPaymentModule,
    HttpSubscriptionModule,
    HttpFavoriteModule,
    HttpParameterModule,
    HttpUploadModule,
    HttpCouponModule,
    HttpUserCouponModule,
    RouterModule.register([
      {
        path: 'companies',
        module: HttpCompanyModule,
      },
      {
        path: 'categories',
        module: HttpCategoryModule,
      },
      {
        path: 'address',
        module: HttpAddressModule,
      },
      {
        path: 'document-types',
        module: HttpDocumentTypeModule,
      },
      {
        path: 'events',
        module: HttpEventModule,
      },
      {
        path: 'informations',
        module: HttpInformationModule,
      },
      {
        path: 'identity-access',
        module: HttpIdentityAccessModule,
      },
      {
        path: 'advertisements',
        module: HttpAdvertisementModule,
      },
      {
        path: 'payment',
        module: HttpPaymentModule,
      },
      {
        path: 'subscriptions',
        module: HttpSubscriptionModule,
      },
      {
        path: 'favorites',
        module: HttpFavoriteModule,
      },
      {
        path: 'parameters',
        module: HttpParameterModule,
      },
      {
        path: 'uploads',
        module: HttpUploadModule,
      },
      {
        path: 'coupons',
        module: HttpCouponModule,
      },
      {
        path: 'user-coupons',
        module: HttpUserCouponModule,
      },
    ]),
  ],
  controllers: [GetMeController],
  providers: [GetMeUseCase],
})
export class HttpModule {}
