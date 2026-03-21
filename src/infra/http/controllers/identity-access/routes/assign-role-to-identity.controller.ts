import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  PreconditionFailedException,
  Put,
} from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AssignRoleToIdentityUseCase } from '@/domain/identity-access/application/use-cases/assign-role-to-identity'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

@Controller('/assign/role/:roleId/to-identity/:identityId')
export class AssignRoleToIdentityController {
  constructor(private assignRoleToIdentity: AssignRoleToIdentityUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Param('roleId') roleId: string,
    @Param('identityId') identityId: string,
  ) {
    const result = await this.assignRoleToIdentity.execute({
      actor: user,
      roleId,
      identityId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
