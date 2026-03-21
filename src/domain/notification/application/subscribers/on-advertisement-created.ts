import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { CompaniesRepository } from '@/domain/ondehoje/application/modules/company/repositories/companies-repository'
import { EventsRepository } from '@/domain/ondehoje/application/modules/event/repositories/events-repository'
import { UsersRepository } from '@/domain/ondehoje/application/modules/user/repositories/users-repository'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { AdvertisementCreatedEvent } from '@/domain/ondehoje/enterprise/events/advertisement-created-event'

import { MailNotifier } from '../notifiers/mail-notifier'
import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnAdvertisementCreated implements EventHandler {
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
    private identitiesRepository: IdentitiesRepository,
    private mailNotifier: MailNotifier,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      /**
       * Bind = Quando essa função for chamada dentro dela o this, tem que significar
       * o mesmo this no momento em que essa função está sendo chamada
       * bind(this) é essa class (OnAdvertisementCreated) sempre vai ser a referência para essa classe
       */
      this.actions.bind(this),
      AdvertisementCreatedEvent.name,
    )
  }

  private async actions({ advertisement }: AdvertisementCreatedEvent) {
    const user = await this.usersRepository.findById(
      advertisement.createdBy.toString(),
    )

    if (!user) {
      return
    }

    let event: Event | null = null
    const eventHasChanged = advertisement.eventId?.toString()

    if (eventHasChanged) {
      const foundEvent = await this.eventsRepository.findById(eventHasChanged)

      if (foundEvent) {
        event = foundEvent
      }
    }

    const company = await this.companiesRepository.findById(
      advertisement.companyId.toString(),
    )

    if (!company) {
      return
    }

    const eventSlug = event ? event.slug.value : ''
    const companySlug = company.slug.value

    const content = eventHasChanged
      ? `Um novo anúncio para o evento: "${event?.name}" foi publicado. O anúncio está aguardando autorização do moderador. Revise as informações no link: ${process.env.APP_URL}/event/${eventSlug}`
      : `Um novo anúncio para a empresa: "${company.name}" foi publicado. O anúncio está aguardando autorização do moderador. Revise as informações no link: ${process.env.APP_URL}/establishment/${companySlug}`

    const action = 'evaluate'
    const entity = 'Advertisement'

    const moderators = await this.identitiesRepository.findManyWithPermission(
      action,
      entity,
    )

    for (const moderator of moderators) {
      await this.sendNotification.execute({
        recipientId: moderator.id,
        title: 'Novo anúncio aguardando autorização',
        content,
      })

      await this.mailNotifier.send({
        email: moderator.email,
        title: 'Novo anúncio aguardando autorização',
        content,
        renderedHtml: `<p>${content}</p>`,
        attachments: [],
      })
    }
  }
}
