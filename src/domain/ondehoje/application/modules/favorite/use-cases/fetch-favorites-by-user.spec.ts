import { makeClient } from 'test/factories/make-client'
import { makeFavorite } from 'test/factories/make-favorite'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'

import { FetchFavoritesByUserUseCase } from './fetch-favorites-by-user'

let inMemoryFavoritesRepository: InMemoryFavoritesRepository

let sut: FetchFavoritesByUserUseCase

describe('Fetch favorites by user', () => {
  beforeEach(() => {
    inMemoryFavoritesRepository = new InMemoryFavoritesRepository()

    sut = new FetchFavoritesByUserUseCase(inMemoryFavoritesRepository)
  })

  it('should be able to list all favorites of a user', async () => {
    const client = makeClient()
    const clientId = client.id.toString()

    const client2 = makeClient()

    const favorite1 = makeFavorite({ userId: client.id })
    const favorite2 = makeFavorite({ userId: client.id })
    const favorite3 = makeFavorite({ userId: client2.id })

    await inMemoryFavoritesRepository.create(favorite1)
    await inMemoryFavoritesRepository.create(favorite2)
    await inMemoryFavoritesRepository.create(favorite3)

    const result = await sut.execute({
      userId: clientId,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.favorites).toHaveLength(2)
    expect(result.value?.favorites).toEqual(
      expect.arrayContaining([favorite1, favorite2]),
    )
  })
})
