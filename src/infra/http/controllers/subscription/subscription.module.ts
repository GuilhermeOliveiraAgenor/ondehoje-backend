import { Module } from '@nestjs/common'

import { GetSubscriptionByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/get-subscription-by-company-slug'
import { GetSubscriptionByIdUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/get-subscription-by-id'
import { RenewSubscriptionUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/renew-subscription'
import { DatabaseModule } from '@/infra/database/database.module'

import { GetSubscriptionByCompanySlugController } from './routes/get-subscription-by-company-slug.controller'
import { GetSubscriptionByIdController } from './routes/get-subscription-by-id.controller'
import { RenewSubscriptionController } from './routes/renew-subscription.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    GetSubscriptionByCompanySlugController,
    GetSubscriptionByIdController,
    RenewSubscriptionController,
  ],
  providers: [
    GetSubscriptionByCompanySlugUseCase,
    GetSubscriptionByIdUseCase,
    RenewSubscriptionUseCase,
  ],
})
export class HttpSubscriptionModule {}
