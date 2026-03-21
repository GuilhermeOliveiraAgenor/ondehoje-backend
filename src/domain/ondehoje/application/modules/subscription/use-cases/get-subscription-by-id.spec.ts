import { makeSubscription } from 'test/factories/make-subscription'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetSubscriptionByIdUseCase } from './get-subscription-by-id'

let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository

let sut: GetSubscriptionByIdUseCase

describe('Get Subscription By Id Use Case', () => {
  beforeEach(() => {
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()

    sut = new GetSubscriptionByIdUseCase(inMemorySubscriptionsRepository)
  })

  it('should be able to get a subscription by id', async () => {
    const subscription = makeSubscription()
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      subscription: expect.objectContaining({
        companyId: expect.any(UniqueEntityID),
      }),
    })
  })

  it('should not be able to get a subscription with invalid id', async () => {
    const result = await sut.execute({
      subscriptionId: 'invalid-id',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
