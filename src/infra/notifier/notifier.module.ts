import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'

import { MailNotifier } from '@/domain/notification/application/notifiers/mail-notifier'

import { EnvModule } from '../env/env.module'
import { NodemailerNotifier } from './nodemailer-notifier'

@Module({
  imports: [
    EnvModule,
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILER_EMAIL_ADDRESS,
          pass: process.env.MAILER_API_KEY,
        },
      },
    }),
  ],
  providers: [{ provide: MailNotifier, useClass: NodemailerNotifier }],
  exports: [MailNotifier],
})
export class NotifierModule {}
