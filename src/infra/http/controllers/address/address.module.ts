import { Module } from '@nestjs/common'

import { AddressesRepository } from '@/domain/ondehoje/application/modules/address/repositories/addresses-repository'
import { CreateAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/create-address'
import { DeleteAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/delete-address'
import { EditAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/edit-address'
import { ListAddressesUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/list-address'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaAddressesRepository } from '@/infra/database/prisma/repositories/prisma-addresses-repository'

import { CreateAddressController } from './routes/create-address.controller'
import { DeleteAddressController } from './routes/delete-address.controller'
import { EditAddressController } from './routes/edit-address.controller'
import { ListAddressesController } from './routes/list-address.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAddressController,
    EditAddressController,
    DeleteAddressController,
    ListAddressesController,
  ],
  providers: [
    CreateAddressUseCase,
    EditAddressUseCase,
    DeleteAddressUseCase,
    ListAddressesUseCase,
    {
      provide: AddressesRepository, // interface
      useClass: PrismaAddressesRepository, // implementação concreta
    },
  ],
})
export class HttpAddressModule {}
