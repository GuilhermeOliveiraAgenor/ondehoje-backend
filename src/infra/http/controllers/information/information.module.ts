import { Module } from '@nestjs/common'

import { EditInformationUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/edit-information'
import { FetchInformationByCompanyIdUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/fetch-information-by-company-id'
import { FetchInformationByEventIdUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/fetch-information-by-event-id'
import { DatabaseModule } from '@/infra/database/database.module'

import { EditInformationController } from './routes/edit-information.controller'
import { FetchInformationByCompanyIdController } from './routes/fetch-information-by-company-id.controller'
import { FetchInformationByEventIdController } from './routes/fetch-information-by-event-id.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    EditInformationController,
    FetchInformationByCompanyIdController,
    FetchInformationByEventIdController,
  ],
  providers: [
    EditInformationUseCase,
    FetchInformationByCompanyIdUseCase,
    FetchInformationByEventIdUseCase,
  ],
})
export class HttpInformationModule {}
