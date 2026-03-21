import { makeEvent } from 'test/factories/make-event'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryEventImagesRepository } from 'test/repositories/in-memory-event-images-repository'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteEventUseCase } from './delete-event'

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

let sut: DeleteEventUseCase

describe('Delete event use case', () => {
  beforeEach(() => {
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

    sut = new DeleteEventUseCase(inMemoryEventsRepository)
  })

  it('should be able to delete a event', async () => {
    const event = makeEvent({
      createdBy: new UniqueEntityID('user-1'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId,
      deletedBy: 'user-1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryEventsRepository.items).toHaveLength(1)
    expect(inMemoryEventsRepository.items[0]).toMatchObject({
      deletedAt: expect.any(Date),
      deletedBy: new UniqueEntityID('user-1'),
    })
  })

  it('should not be able to delete a event that does not exist', async () => {
    const result = await sut.execute({
      eventId: 'non-existent-event',
      deletedBy: 'user-1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a event if user is not the creator', async () => {
    const event = makeEvent()
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId,
      deletedBy: 'user-1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
