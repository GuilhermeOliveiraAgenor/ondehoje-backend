import {
  MailNotifier,
  MailNotifierProps,
} from '@/domain/notification/application/notifiers/mail-notifier'

export class FakeNotifier implements MailNotifier {
  send({ email, title, content }: MailNotifierProps): Promise<void> {
    console.log(
      `Simulating notification sent to ${email}: ${title} - ${content}`,
    )
    return Promise.resolve()
  }
}
