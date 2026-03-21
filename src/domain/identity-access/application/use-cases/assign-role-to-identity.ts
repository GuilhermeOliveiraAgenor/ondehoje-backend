import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { IdentityRole } from '../../enterprise/entities/identity-role'
import { IdentityRoleList } from '../../enterprise/entities/identity-role-list'
import { IdentityDetails } from '../../enterprise/entities/value-object/identity-details'
import { IdentitiesRepository } from '../repositories/identities-repository'
import { IdentitiesRolesRepository } from '../repositories/identities-roles-repository'
import { RolesRepository } from '../repositories/roles-repository'

interface AssignRoleToIdentityUseCaseRequest {
  actor: IdentityDetails
  roleId: string
  identityId: string
}

type AssignRoleToIdentityUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

@Injectable()
export class AssignRoleToIdentityUseCase {
  constructor(
    private rolesRepository: RolesRepository,
    private identitiesRepository: IdentitiesRepository,
    private identitiesRolesRepository: IdentitiesRolesRepository,
  ) {}

  async execute({
    actor,
    roleId,
    identityId,
  }: AssignRoleToIdentityUseCaseRequest): Promise<AssignRoleToIdentityUseCaseResponse> {
    const isActorAdmin = actor.roles.has('ADMINISTRATOR')

    if (!isActorAdmin) {
      return failure(new NotAllowedError())
    }

    const role = await this.rolesRepository.findById(roleId)

    if (!role) {
      return failure(new ResourceNotFoundError('Role'))
    }

    const identity = await this.identitiesRepository.findById(identityId)

    if (!identity) {
      return failure(new ResourceNotFoundError('Identity'))
    }

    const currentRoles =
      await this.identitiesRolesRepository.findManyByIdentityId(identityId)

    const identityRolesList = new IdentityRoleList(currentRoles)

    const identityRole = IdentityRole.create({
      identityId: identity.id,
      roleId: role.id,
    })

    identityRolesList.update([identityRole])

    identity.roles = identityRolesList

    await this.identitiesRepository.save(identity)

    return success(null)
  }
}
