import { Module } from '@nestjs/common'

import { GetParameterByKeyUseCase } from '@/domain/ondehoje/application/modules/parameter/use-cases/get-parameter-by-key'
import { DatabaseModule } from '@/infra/database/database.module'

import { GetParameterByKeyController } from './routes/get-parameter-by-key.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [GetParameterByKeyController],
  providers: [GetParameterByKeyUseCase],
})
export class HttpParameterModule {}
