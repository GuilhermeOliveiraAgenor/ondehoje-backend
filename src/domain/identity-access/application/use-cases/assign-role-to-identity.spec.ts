import { makeIdentity } from 'test/factories/make-identity'
import { makeIdentityDetails } from 'test/factories/make-identity-details'
import { makeRole } from 'test/factories/make-role'
import { makeUser } from 'test/factories/make-user'
import { InMemoryIdentitiesRepository } from 'test/repositories/in-memory-identities-repository'
import { InMemoryIdentitiesRolesRepository } from 'test/repositories/in-memory-identities-roles-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryPermissionsRepository } from 'test/repositories/in-memory-permissions-repository'
import { InMemoryRolesPermissionsRepository } from 'test/repositories/in-memory-roles-permissions-repository'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { IdentityRoleList } from '../../enterprise/entities/identity-role-list'
import { AssignRoleToIdentityUseCase } from './assign-role-to-identity'

let inMemoryRolesPermissionsRepository: InMemoryRolesPermissionsRepository
let inMemoryRolesRepository: InMemoryRolesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPermissionsRepository: InMemoryPermissionsRepository
let inMemoryIdentitiesRolesRepository: InMemoryIdentitiesRolesRepository
let inMemoryIdentitiesRepository: InMemoryIdentitiesRepository

let sut: AssignRoleToIdentityUseCase

describe('Assign Role to Identity Use Case', () => {
  beforeEach(() => {
    inMemoryRolesPermissionsRepository =
      new InMemoryRolesPermissionsRepository()
    inMemoryRolesRepository = new InMemoryRolesRepository(
      inMemoryRolesPermissionsRepository,
    )
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    inMemoryPermissionsRepository = new InMemoryPermissionsRepository()
    inMemoryIdentitiesRolesRepository = new InMemoryIdentitiesRolesRepository()
    inMemoryIdentitiesRepository = new InMemoryIdentitiesRepository(
      inMemoryUsersRepository,
      inMemoryRolesRepository,
      inMemoryPermissionsRepository,
      inMemoryIdentitiesRolesRepository,
      inMemoryRolesPermissionsRepository,
    )

    sut = new AssignRoleToIdentityUseCase(
      inMemoryRolesRepository,
      inMemoryIdentitiesRepository,
      inMemoryIdentitiesRolesRepository,
    )
  })

  it('should be able to assign a role to an identity', async () => {
    const actor = makeIdentityDetails({
      roles: new Set(['ADMINISTRATOR']),
    })

    const role = makeRole({ name: 'MODERATOR' })
    const roleId = role.id.toString()
    await inMemoryRolesRepository.create(role)

    const user = makeUser()
    const identity = makeIdentity(
      {
        id: user.id,
        roles: new IdentityRoleList(),
      },
      user.id,
    )
    const identityId = identity.id.toString()
    await inMemoryUsersRepository.create(user)
    await inMemoryIdentitiesRepository.create(identity)

    const result = await sut.execute({
      actor,
      roleId,
      identityId,
    })

    expect(result.isSuccess()).toBe(true)

    expect(inMemoryIdentitiesRolesRepository.items).toHaveLength(1)
    expect(inMemoryIdentitiesRolesRepository.items[0]).toMatchObject({
      identityId: identity.id,
      roleId: role.id,
    })
  })
})
