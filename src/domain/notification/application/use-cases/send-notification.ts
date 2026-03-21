import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: Notification['recipientId']
  title: Notification['title']
  content: Notification['content']
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId,
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return success({
      notification,
    })
  }
}
