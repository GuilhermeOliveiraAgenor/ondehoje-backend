import { faker } from '@faker-js/faker'
import { makeEvent } from 'test/factories/make-event'
import { makeEventImage } from 'test/factories/make-event-image'
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
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { EventEndDateBeforeStartDateError } from '../errors/event-end-date-before-start-date-error'
import { EventStartDateAfterEndDateError } from '../errors/event-start-date-after-end-date-error'
import { InvalidEventDateRangeError } from '../errors/invalid-event-date-range-error'
import { EditEventUseCase } from './edit-event'

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

let sut: EditEventUseCase

describe('Edit event use case', () => {
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

    inMemoryAdvertisementAuthorizationsRepository =
      new InMemoryAdvertisementAuthorizationsRepository()

    inMemoryAdvertisementsRepository = new InMemoryAdvertisementsRepository(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
      inMemoryAdvertisementAuthorizationsRepository,
    )

    sut = new EditEventUseCase(
      inMemoryEventsRepository,
      inMemoryAddressesRepository,
      inMemoryCategoriesRepository,
      inMemoryInformationsRepository,
      inMemoryEventImagesRepository,
      inMemoryAdvertisementsRepository,
    )
  })

  it('should be able to edit a event', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const newStartDate = faker.date.soon({ days: 10 })
    const newEndDate = new Date(newStartDate)
    newEndDate.setHours(newEndDate.getHours() + 2)

    const result = await sut.execute({
      eventId,
      name: 'Event edited',
      description: 'Description edited',
      startDate: newStartDate,
      endDate: newEndDate,
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryEventsRepository.items[0]).toMatchObject({
      name: 'Event edited',
      description: 'Description edited',
      startDate: newStartDate,
      endDate: newEndDate,
    })
    expect(inMemoryEventsRepository.items[0].slug.value).toEqual('event-edited')
  })

  it('should not be able to edit a non-existent event', async () => {
    const result = await sut.execute({
      eventId: 'non-existent-event',
      name: 'Evento Editado',
      updatedBy: 'user-1',
      imagesIds: ['image-1', 'image-2'],
    })
    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a event if user is not the creator', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId,
      name: 'Event edited',
      description: 'Description edited',
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a event with an address that does not exist', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId,
      addressId: 'non-existent-address',
      name: 'Event edited',
      description: 'Description edited',
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toMatchObject({ message: 'Address not found.' })
  })

  it('should not be able to edit a event with a category that does not exist', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId,
      categoryId: 'non-existent-address',
      name: 'Event edited',
      description: 'Description edited',
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toMatchObject({ message: 'Category not found.' })
  })

  it('should not be able to edit an event with a name that is already in use by the same company', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
      companyId: new UniqueEntityID('company-1'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const anotherEvent = makeEvent({
      name: 'Event already in use',
      companyId: new UniqueEntityID('company-1'),
    })
    await inMemoryEventsRepository.create(anotherEvent)

    const result = await sut.execute({
      eventId,
      name: 'Event already in use',
      description: 'Description edited',
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(EventAlreadyExistsError)
  })

  it('should not be able to edit an event with a wrong range of dates', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const newStartDate = new Date()
    const newEndDate = faker.date.past({ years: 1 })

    const result = await sut.execute({
      eventId,
      name: 'Event edited',
      description: 'Description edited',
      startDate: newStartDate,
      endDate: newEndDate,
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEventDateRangeError)
  })

  it('should not be able to edit an event with a start date after the end date', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      endDate: faker.date.past({ years: 1 }),
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const newStartDate = new Date()

    const result = await sut.execute({
      eventId,
      name: 'Event edited',
      description: 'Description edited',
      startDate: newStartDate,
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(EventStartDateAfterEndDateError)
  })

  it('should not be able to edit an event with a end date after the start date', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      startDate: faker.date.soon({ days: 1 }),
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const endDate = new Date()

    const result = await sut.execute({
      eventId,
      name: 'Event edited',
      description: 'Description editedd',
      endDate,
      updatedBy: 'user-id',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(EventEndDateBeforeStartDateError)
  })

  it('should be able to edit an event and remove old images not included anymore', async () => {
    const event = makeEvent({
      name: 'Event original',
      description: 'Description original',
      createdBy: new UniqueEntityID('user-id'),
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const image1 = makeEventImage({
      eventId: event.id,
      imageId: new UniqueEntityID('image-1'),
    })

    const image2 = makeEventImage({
      eventId: event.id,
      imageId: new UniqueEntityID('image-2'),
    })

    await inMemoryEventImagesRepository.createMany([image1, image2])

    const result = await sut.execute({
      eventId,
      name: 'Event edited with new images',
      updatedBy: 'user-id',
      imagesIds: ['image-2'],
    })

    expect(result.isSuccess()).toBe(true)

    const remainingImages =
      await inMemoryEventImagesRepository.findManyByEventId(eventId)

    expect(remainingImages).toHaveLength(1)
    expect(remainingImages[0].imageId.toString()).toBe('image-2')
  })
})
