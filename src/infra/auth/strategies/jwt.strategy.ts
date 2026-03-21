import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { IdentitiesRepository } from '@/domain/identity-access/application/repositories/identities-repository'
import { EnvService } from '@/infra/env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
})

export type IdentityDetails = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: EnvService,
    private identitiesRepository: IdentitiesRepository,
  ) {
    const publicKey = config.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  private static extractJWT(request: Request): string | null {
    if (
      request.cookies &&
      'ondehoje_token' in request.cookies &&
      request.cookies.ondehoje_token.length > 0
    ) {
      return request.cookies.ondehoje_token
    }
    return null
  }

  async validate(payload: IdentityDetails) {
    const validatedPayload = tokenPayloadSchema.parse(payload)

    const identity = await this.identitiesRepository.findIdentityDetailsById(
      validatedPayload.sub,
    )

    if (!identity) {
      throw new UnauthorizedException('User profile not found')
    }

    return identity
  }
}
