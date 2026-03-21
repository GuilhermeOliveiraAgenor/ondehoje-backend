import { Module } from '@nestjs/common'

import { UploadAndCreateManyDocumentsUseCase } from '@/domain/ondehoje/application/modules/document/use-cases/upload-and-create-many-documents'
import { UploadAndCreateManyImagesUseCase } from '@/domain/ondehoje/application/modules/image/use-case/upload-and-create-many-images'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { UploadDocumentsController } from './routes/upload-documents.controller'
import { UploadImagesController } from './routes/upload-images.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [UploadDocumentsController, UploadImagesController],
  providers: [
    UploadAndCreateManyDocumentsUseCase,
    UploadAndCreateManyImagesUseCase,
  ],
})
export class HttpUploadModule {}
