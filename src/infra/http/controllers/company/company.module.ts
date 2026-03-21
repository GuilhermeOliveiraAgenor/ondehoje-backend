import { Module } from '@nestjs/common'

import { CreateCompanyUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/create-company'
import { EditCompanyUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/edit-company'
import { FetchCompaniesUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-companies'
import { FetchCompaniesForUserUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-companies-for-user'
import { FetchMyCompaniesUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-my-companies'
import { GetCompanyBySlugUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/get-company-by-slug'
import { UploadAndCreateManyImagesUseCase } from '@/domain/ondehoje/application/modules/image/use-case/upload-and-create-many-images'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { CreateCompanyController } from './routes/create-company.controller'
import { EditCompanyController } from './routes/edit-company.controller'
import { FetchCompaniesController } from './routes/fetch-companies.controller'
import { FetchCompaniesForUserController } from './routes/fetch-companies-for-user.controller'
import { FetchMyCompaniesController } from './routes/fetch-my-companies.controller'
import { GetCompanyBySlugController } from './routes/get-company-by-slug.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateCompanyController,
    EditCompanyController,
    FetchMyCompaniesController,
    GetCompanyBySlugController,
    FetchCompaniesController,
    FetchCompaniesForUserController,
  ],
  providers: [
    CreateCompanyUseCase,
    EditCompanyUseCase,
    FetchMyCompaniesUseCase,
    UploadAndCreateManyImagesUseCase,
    GetCompanyBySlugUseCase,
    FetchCompaniesUseCase,
    FetchCompaniesForUserUseCase,
  ],
})
export class HttpCompanyModule {}
