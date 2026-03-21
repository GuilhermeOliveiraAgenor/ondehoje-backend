import { Module } from '@nestjs/common'

import { RegisterDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/create-document-type'
import { EditCompanyTypeDocumentUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/edit-document-type'
import { GetDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/get-document-type'
import { ListDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/list-document-type'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateDocumentTypeController } from './routes/create-document-type.controller'
import { EditDocumentTypeController } from './routes/edit-document-type.controller'
import { GetDocumentTypeController } from './routes/get-document-type.controller'
import { ListDocumentTypeController } from './routes/list-document-type.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateDocumentTypeController,
    GetDocumentTypeController,
    EditDocumentTypeController,
    ListDocumentTypeController,
  ],
  providers: [
    RegisterDocumentTypeUseCase,
    EditCompanyTypeDocumentUseCase,
    GetDocumentTypeUseCase,
    ListDocumentTypeUseCase,
  ],
})
export class HttpDocumentTypeModule {}
