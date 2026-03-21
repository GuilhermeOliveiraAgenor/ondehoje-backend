import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { CreateClientUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/create-client'
import { GetClientByEmailUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/get-client-by-email'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { GoogleAuthController } from './providers/google/google-auth.controller'
import { GoogleAuthStrategy } from './strategies/google-auth.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    EnvModule,
    DatabaseModule,
    CryptographyModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  controllers: [GoogleAuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    GoogleAuthStrategy,
    GetClientByEmailUseCase,
    CreateClientUseCase,
  ],
})
export class AuthModule {}
