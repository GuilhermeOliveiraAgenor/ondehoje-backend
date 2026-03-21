import { makeAddress } from 'test/factories/make-address'
import { makeAdvertisement } from 'test/factories/make-advertisement'
import { makeCompany } from 'test/factories/make-company'
import { makeIdentity } from 'test/factories/make-identity'
import { makeIdentityRole } from 'test/factories/make-identity-role'
import { makePermission } from 'test/factories/make-permission'
import { makeRole } from 'test/factories/make-role'
import { makeRolePermission } from 'test/factories/make-role-permission'
import { makeUser } from 'test/factories/make-user'
import { FakeNotifier } from 'test/notifiers/fake-notifier'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryAdvertisementAuthorizationsRepository } from 'test/repositories/in-memory-advertisement-authorizations-repository'
import { InMemoryAdvertisementsRepository } from 'test/repositories/in-memory-advertisements-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryEventImagesRepository } from 'test/repositories/in-memory-event-images-repository'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryIdentitiesRepository } from 'test/repositories/in-memory-identities-repository'
import { InMemoryIdentitiesRolesRepository } from 'test/repositories/in-memory-identities-roles-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryPermissionsRepository } from 'test/repositories/in-memory-permissions-repository'
import { InMemoryRolesPermissionsRepository } from 'test/repositories/in-memory-roles-permissions-repository'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnAdvertisementCreated } from './on-advertisement-created'

let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRolesPermissionsRepository: InMemoryRolesPermissionsRepository
let inMemoryRolesRepository: InMemoryRolesRepository
let inMemoryPermissionsRepository: InMemoryPermissionsRepository
let inMemoryIdentitiesRolesRepository: InMemoryIdentitiesRolesRepository
let inMemoryIdentitiesRepository: InMemoryIdentitiesRepository
let fakeNotifier: FakeNotifier
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryCompanyDocumentsRepository: InMemoryCompanyDocumentsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCompanyImagesRepository: InMemoryCompanyImagesRepository
let inMemoryInformationsRepository: InMemoryInformationsRepository
let inMemoryFavoritesRepository: InMemoryFavoritesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryEventImagesRepository: InMemoryEventImagesRepository
let inMemoryEventsRepository: InMemoryEventsRepository
let inMemoryAdvertisementsRepository: InMemoryAdvertisementsRepository
let inMemoryAdvertisementAuthorizationsRepository: InMemoryAdvertisementAuthorizationsRepository

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Advertisement Created Subscriber', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    inMemoryRolesPermissionsRepository =
      new InMemoryRolesPermissionsRepository()
    inMemoryRolesRepository = new InMemoryRolesRepository(
      inMemoryRolesPermissionsRepository,
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

    fakeNotifier = new FakeNotifier()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryCompanyDocumentsRepository =
      new InMemoryCompanyDocumentsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryCompanyImagesRepository = new InMemoryCompanyImagesRepository()
    inMemoryInformationsRepository = new InMemoryInformationsRepository()
    inMemoryFavoritesRepository = new InMemoryFavoritesRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryAddressesRepository,
      inMemoryDocumentsRepository,
      inMemoryCompanyDocumentsRepository,
      inMemoryImagesRepository,
      inMemoryCompanyImagesRepository,
      inMemoryInformationsRepository,
      inMemoryFavoritesRepository,
    )
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryEventImagesRepository = new InMemoryEventImagesRepository()
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryCompaniesRepository,
      inMemoryAddressesRepository,
      inMemoryCategoriesRepository,
      inMemoryInformationsRepository,
      inMemoryImagesRepository,
      inMemoryEventImagesRepository,
    )

    inMemoryAdvertisementAuthorizationsRepository =
      new InMemoryAdvertisementAuthorizationsRepository()

    inMemoryAdvertisementsRepository = new InMemoryAdvertisementsRepository(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
      inMemoryAdvertisementAuthorizationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAdvertisementCreated(
      inMemoryUsersRepository,
      inMemoryEventsRepository,
      inMemoryCompaniesRepository,
      inMemoryIdentitiesRepository,
      fakeNotifier,
      sendNotificationUseCase,
    )
  })

  it('should be able to notify moderators when a new advertisement is created', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const permission = makePermission({
      action: 'evaluate',
      entity: 'Advertisement',
    })
    await inMemoryPermissionsRepository.create(permission)

    const role = makeRole({ name: 'Moderator' })
    await inMemoryRolesRepository.create(role)

    const rolePermission = makeRolePermission({
      permissionId: permission.id,
      roleId: role.id,
    })
    await inMemoryRolesPermissionsRepository.createMany([rolePermission])

    const identity = makeIdentity({}, user.id)
    await inMemoryIdentitiesRepository.create(identity)

    const identityRoles = makeIdentityRole({
      identityId: identity.id,
      roleId: role.id,
    })
    await inMemoryIdentitiesRolesRepository.createMany([identityRoles])

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const advertisement = makeAdvertisement({
      companyId: company.id,
      createdBy: user.id,
    })
    await inMemoryAdvertisementsRepository.create(advertisement)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
