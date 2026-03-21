import { Injectable } from '@nestjs/common'

import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { MailNotifier } from '@/domain/notification/application/notifiers/mail-notifier'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { UsersRepository } from '../../user/repositories/users-repository'
import { AdvertisementStateHandler } from './advertisement-state-handler'

@Injectable()
export class AdvertisementWaitingAuthorizationStateHandler
  implements AdvertisementStateHandler
{
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
    private sendNotification: SendNotificationUseCase,
    private mailNotifier: MailNotifier,
    private identitiesRepository: IdentitiesRepository,
  ) {}

  async handle(advertisement: Advertisement): Promise<void> {
    console.log(
      `Handling WAITING_AUTHORIZATION for advertisement ID: ${advertisement.id}`,
    )

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
      ? `Seu evento: "${event?.name}" foi alterado. O anúncio publicado está aguardando nova autorização do moderador. Revise as informações no link: ${process.env.APP_URL}/event/${eventSlug}`
      : `Sua empresa: "${company.name}" foi alterada. O anúncio publicado está aguardando nova autorização do moderador. Revise as informações no link: ${process.env.APP_URL}/establishment/${companySlug}`

    await this.sendNotification.execute({
      recipientId: user.id,
      title: 'Publicidade aguardando autorização',
      content,
    })

    await this.mailNotifier.send({
      email: user.email,
      title: 'Publicidade aguardando autorização',
      content,
      renderedHtml: `<p>${content}</p>`,
      attachments: [],
    })

    const action = 'evaluate'
    const entity = 'Advertisement'

    const moderators = await this.identitiesRepository.findManyWithPermission(
      action,
      entity,
    )

    const contentForModerators = eventHasChanged
      ? `O evento: "${event?.name}" foi alterado. O anúncio publicado está aguardando nova autorização.`
      : `A empresa: "${company.name}" foi alterada. O anúncio publicado está aguardando nova autorização.`

    for (const moderator of moderators) {
      await this.sendNotification.execute({
        recipientId: moderator.id,
        title: 'Publicidade aguardando autorização',
        content: contentForModerators,
      })

      await this.mailNotifier.send({
        email: moderator.email,
        title: 'Publicidade aguardando autorização',
        content: contentForModerators,
        renderedHtml: `<p>${contentForModerators}</p>`,
        attachments: [],
      })
    }
  }
}
