import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

import {
  MailNotifier,
  MailNotifierProps,
} from '@/domain/notification/application/notifiers/mail-notifier'

import { EnvService } from '../env/env.service'

@Injectable()
export class NodemailerNotifier implements MailNotifier {
  private MAILER_EMAIL_ADDRESS: string

  constructor(
    private mailerService: MailerService,
    private env: EnvService,
  ) {
    this.MAILER_EMAIL_ADDRESS = this.env.get('MAILER_EMAIL_ADDRESS')
  }

  async send({
    title,
    email,
    renderedHtml,
    attachments,
  }: MailNotifierProps): Promise<void> {
    const message = {
      to: email,
      from: `ONDE HOJE ${this.MAILER_EMAIL_ADDRESS}`,
      subject: title,
      html: renderedHtml,
      attachDataUrls: true,
      attachments,
    }

    await this.mailerService.sendMail(message).catch((err) => {
      console.error(`Nodemailer Notifier Error - ${JSON.stringify(err)}`)
      // logger.error(`Nodemailer Notifier Error - ${JSON.stringify(err)}`)
    })
  }
}
