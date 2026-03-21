import { Injectable } from '@nestjs/common'

import { MailNotifier } from '@/domain/notification/application/notifiers/mail-notifier'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { CreatePaymentUseCase } from '@/domain/payment/application/use-cases/create-payment'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { UsersRepository } from '../../user/repositories/users-repository'
import { AdvertisementStateHandler } from './advertisement-state-handler'

@Injectable()
export class AdvertisementWaitingPaymentStateHandler
  implements AdvertisementStateHandler
{
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
    private createPayment: CreatePaymentUseCase,
    private sendNotification: SendNotificationUseCase,
    private mailNotifier: MailNotifier,
  ) {}

  async handle(advertisement: Advertisement): Promise<void> {
    console.log(
      `Handling WAITING_PAYMENT STATE for advertisement ID: ${advertisement.id}`,
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

    const expiresAtTomorrow = new Date()
    expiresAtTomorrow.setHours(expiresAtTomorrow.getHours() + 24)

    const result = await this.createPayment.execute({
      advertisement,
      amount: advertisement.amount,
      expiresAt: expiresAtTomorrow,
    })

    if (result.isError()) {
      console.log(
        `Failed to create payment for advertisement ID: ${advertisement.id}`,
      )
      return
    }

    const { payment } = result.value

    const content = eventHasChanged
      ? `Seu anúncio para o evento: "${event?.name}" está aguardando pagamento. Segue link para o pagamento: ${payment.link}`
      : `Seu anúncio para a empresa: "${company.name}" está aguardando pagamento. Segue link para o pagamento: ${payment.link}`

    const title = eventHasChanged
      ? `Anúncio do evento: "${event?.name}" está aguardando pagamento.`
      : `Anúncio da empresa: "${company.name}" está aguardando pagamento.`

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
