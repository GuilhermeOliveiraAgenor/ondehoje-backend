import { makeEvent } from 'test/factories/make-event'
import { makeInformation } from 'test/factories/make-information'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { FetchInformationByEventIdUseCase } from './fetch-information-by-event-id'

let inMemoryInformationRepository: InMemoryInformationsRepository
let sut: FetchInformationByEventIdUseCase

describe('Fetch Information by Event Id', () => {
  beforeEach(() => {
    inMemoryInformationRepository = new InMemoryInformationsRepository()

    sut = new FetchInformationByEventIdUseCase(inMemoryInformationRepository)
  })

  it('should be able to fetch Information by event', async () => {
    const event = makeEvent()
    const eventId = event.id.toString()

    const information = makeInformation({
      eventId: event.id,
      name: 'Lista de informações',
    })
    await inMemoryInformationRepository.createMany([information])

    const result = await sut.execute({
      eventId,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      informations: expect.arrayContaining([
        expect.objectContaining({
          name: 'Lista de informações',
          eventId: event.id,
        }),
      ]),
    })
  })
})
