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

describe('Edit address Controller (e2e)', () => {
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

  test('[PUT] /address', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const address = await addressFactory.makePrismaAddress({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .put(`/address/${address.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        street: 'Victor Ferreira do Amaral',
        complement: 'Residencial',
        neighborhood: 'Capão da Imbuia',
        number: '2',
        cep: '80000001',
        city: 'Curitiba',
        state: 'Paraná',
        longitude: 8789988978,
        latitude: 889788989,
        addressId: address.id,
      })

    expect(response.statusCode).toBe(200)

    const addressOnDatabase = await prisma.address.findUnique({
      where: {
        id: address.id.toString(),
      },
    })

    expect(addressOnDatabase).not.toBeNull()
    expect(addressOnDatabase).toMatchObject({
      street: 'Victor Ferreira do Amaral',
      complement: 'Residencial',
      number: '2',
    })
  })
})
