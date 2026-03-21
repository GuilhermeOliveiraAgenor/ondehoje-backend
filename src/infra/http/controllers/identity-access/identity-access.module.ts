import { Module } from '@nestjs/common'

import { AssignRoleToIdentityUseCase } from '@/domain/identity-access/application/use-cases/assign-role-to-identity'
import { DatabaseModule } from '@/infra/database/database.module'

import { AssignRoleToIdentityController } from './routes/assign-role-to-identity.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [AssignRoleToIdentityController],
  providers: [AssignRoleToIdentityUseCase],
})
export class HttpIdentityAccessModule {}
