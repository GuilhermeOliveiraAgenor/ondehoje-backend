import { Module } from '@nestjs/common'

import { CreateAdvertisementUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/create-advertisement'
import { EvaluateAdvertisementUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/evaluate-advertisement'
import { FetchAdvertisementsByCompanyIdUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-company-id'
import { FetchAdvertisementsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-company-slug'
import { FetchAdvertisementsByEventIdUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-event-id'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateAdvertisementController } from './routes/create-advertisement.controller'
import { EvaluateAdvertisementController } from './routes/evaluate-advertisement.controller'
import { FetchAdvertisementsByCompanyIdController } from './routes/fetch-advertisements-by-company-id.controller'
import { FetchAdvertisementsByCompanySlugController } from './routes/fetch-advertisements-by-company-slug.controller'
import { FetchAdvertisementsByEventIdController } from './routes/fetch-advertisements-by-event-id.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAdvertisementController,
    EvaluateAdvertisementController,
    FetchAdvertisementsByCompanySlugController,
    FetchAdvertisementsByCompanyIdController,
    FetchAdvertisementsByEventIdController,
  ],
  providers: [
    CreateAdvertisementUseCase,
    EvaluateAdvertisementUseCase,
    FetchAdvertisementsByCompanySlugUseCase,
    FetchAdvertisementsByCompanyIdUseCase,
    FetchAdvertisementsByEventIdUseCase,
  ],
})
export class HttpAdvertisementModule {}
