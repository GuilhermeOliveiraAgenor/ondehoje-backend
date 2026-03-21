import { Injectable } from '@nestjs/common'

import { MailNotifier } from '@/domain/notification/application/notifiers/mail-notifier'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'

import { AdvertisementAuthorizationsRepository } from '../../advertisement-authorization/repositories/advertisement-authorizations-repository'
import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { UsersRepository } from '../../user/repositories/users-repository'
import { AdvertisementStateHandler } from './advertisement-state-handler'

@Injectable()
export class AdvertisementNotAuthorizedStateHandler
  implements AdvertisementStateHandler
{
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
    private advertisementAuthorizationsRepository: AdvertisementAuthorizationsRepository,
    private sendNotification: SendNotificationUseCase,
    private mailNotifier: MailNotifier,
  ) {}

  async handle(advertisement: Advertisement): Promise<void> {
    console.log(
      `Handling NOT_AUTHORIZED STATE for advertisement ID: ${advertisement.id}`,
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

    const advertisementAuthorizations =
      await this.advertisementAuthorizationsRepository.findManyByAdvertisementId(
        advertisement.id.toString(),
      )

    const rejectedReason =
      advertisementAuthorizations[0].rejectedReason || 'Não especificado'

    const content = eventHasChanged
      ? `Seu anúncio para o evento: "${event?.name}" não foi autorizado. Por motivos de: ${rejectedReason}`
      : `Seu anúncio para a empresa: "${company.name}" não foi autorizado. Por motivos de: ${rejectedReason}`

    const title = eventHasChanged
      ? `Anúncio do evento: "${event?.name}" rejeitado`
      : `Anúncio da empresa: "${company.name}" rejeitado`

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
