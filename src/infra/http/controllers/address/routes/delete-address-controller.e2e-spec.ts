import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete address Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let addressFactory: AddressFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    addressFactory = moduleRef.get(AddressFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /address', async () => {
    // Cria um client no banco
    const client = await clientFactory.makePrismaClient()

    // Gera o token JWT
    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const address = await addressFactory.makePrismaAddress({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .delete(`/address/${address.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const addressOnDatabase = await prisma.address.findUnique({
      where: { id: address.id.toString() },
    })

    expect(response.statusCode).toBe(204)
    expect(addressOnDatabase).toBeNull()
  })
})
