import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

import { CreateClientUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/create-client'
import { GetClientByEmailUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/get-client-by-email'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: EnvService,
    private getClientByEmailUseCase: GetClientByEmailUseCase,
    private createClientUseCase: CreateClientUseCase,
  ) {
    super({
      clientID: config.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_OAUTH_REDIRECT_URI'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { _json: data, emails } = profile

    let email = ''

    if (emails && emails.length > 0) {
      email = emails[0].value
    }

    let client: Client | null = null

    client = await this.getClientByEmailUseCase.execute({
      email,
    })

    if (!client) {
      const result = await this.createClientUseCase.execute({
        name: data.name ?? '',
        email,
        password: '', // Password is not used for OAuth clients
        birthDate: new Date(),
        provider: 'google',
        imageUrl: data.picture || '',
      })

      if (result.isError()) {
        throw new Error('Failed to create client via Google OAuth')
      }

      client = result.value.client
    }

    done(null, client)
    return client
  }
}
