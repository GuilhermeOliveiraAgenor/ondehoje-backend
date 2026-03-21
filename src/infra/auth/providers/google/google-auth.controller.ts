import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'

import { Client } from '@/domain/ondehoje/enterprise/entities/client'
import { EnvService } from '@/infra/env/env.service'

import { Public } from '../../decorators/public'
import { GoogleAuthGuard } from '../../guards/google-auth.guard'

@Controller('/auth/google')
@Public()
export class GoogleAuthController {
  private GOOGLE_OAUTH_RESPONSE_URL: string = ''

  constructor(
    private jwtService: JwtService,
    private env: EnvService,
  ) {
    this.GOOGLE_OAUTH_RESPONSE_URL = this.env.get('GOOGLE_OAUTH_RESPONSE_URL')
  }

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
    const client = request.user as Client

    if (!client) {
      return response.redirect('/login-error')
    }

    const payload = {
      sub: client.id.toString(),
      email: client.email,
    }

    const accessToken = this.jwtService.sign(payload)

    const url = new URL(this.GOOGLE_OAUTH_RESPONSE_URL)
    url.searchParams.append('token', accessToken)

    response.redirect(url.toString())
  }
}
