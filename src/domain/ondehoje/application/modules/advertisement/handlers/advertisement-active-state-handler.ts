import { Injectable } from '@nestjs/common'

import { MailNotifier } from '@/domain/notification/application/notifiers/mail-notifier'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { UsersRepository } from '../../user/repositories/users-repository'
import { AdvertisementStateHandler } from './advertisement-state-handler'

@Injectable()
export class AdvertisementActiveStateHandler
  implements AdvertisementStateHandler
{
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
    private sendNotification: SendNotificationUseCase,
    private mailNotifier: MailNotifier,
  ) {}

  async handle(advertisement: Advertisement): Promise<void> {
    console.log(
      `Handling ACTIVE STATE for advertisement ID: ${advertisement.id}`,
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
      ? `Seu evento: "${event?.name}" foi autorizado e está ativo. Visualize seu anúncio na plataforma em: ${process.env.APP_URL}/event/${eventSlug}`
      : `Seu anúncio para a empresa: "${company.name}" foi autorizado e está ativo. Visualize seu anúncio na plataforma em: ${process.env.APP_URL}/establishment/${companySlug}`

    const title = eventHasChanged
      ? `Anúncio do evento: "${event?.name}" está ativo`
      : `Anúncio da empresa: "${company.name}" está ativo`

    await this.sendNotification.execute({
      recipientId: user.id,
      title,
      content,
    })

    await this.mailNotifier.send({
      email: user.email,
      title,
      content,
      renderedHtml: `<p>${content}</p>`,
      attachments: [],
    })
  }
}
