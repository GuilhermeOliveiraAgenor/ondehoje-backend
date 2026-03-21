import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOptions: CorsOptions = {
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'PATH',
      'OPTIONS',
      'HEAD',
    ],
    origin: ['http://localhost:3000'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Authorization',
      'Content-Type',
      'Accept',
    ],
    exposedHeaders: ['Set-Cookie'],
  }

  app.enableCors(corsOptions)

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
