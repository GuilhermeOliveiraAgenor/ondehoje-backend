import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { AdvertisementChangedEvent } from '../../enterprise/events/advertisement-changed-event'
import { AdvertisementStateHandlerFactory } from '../modules/advertisement/handlers/advertisement-state-handler-factory'

@Injectable()
export class OnAdvertisementChanged implements EventHandler {
  constructor(private stateHandlerFactory: AdvertisementStateHandlerFactory) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handle.bind(this),
      AdvertisementChangedEvent.name,
    )
  }

  private async handle({
    advertisement,
  }: AdvertisementChangedEvent): Promise<void> {
    const status = advertisement.status
    console.log(`Handling advertisement changed event for status: ${status}`)
    const handler = this.stateHandlerFactory.execute(status)

    if (!handler) {
      console.log(`No handler found for advertisement status: ${status}`)
      return
    }

    await handler.handle(advertisement)
  }
}
