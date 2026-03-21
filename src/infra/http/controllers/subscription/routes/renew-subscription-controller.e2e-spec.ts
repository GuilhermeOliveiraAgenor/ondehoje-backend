import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { SubscriptionFactory } from 'test/factories/make-subscription'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Renew Subscription Controller', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let subscriptionFactory: SubscriptionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        SubscriptionFactory,
        CompanyFactory,
        AddressFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    subscriptionFactory = moduleRef.get(SubscriptionFactory)
    addressFactory = moduleRef.get(AddressFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /subscriptions', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const address = await addressFactory.makePrismaAddress({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const company = await companyFactory.makePrismaCompany({
      addressId: address.id,
      createdBy: new UniqueEntityID(client.id.toString()),
      status: 'ACTIVE',
    })

    await prisma.parameter.createMany({
      data: [
        {
          key: 'subscription.renewal.days',
          value: '30',
          keyInfo: 'Número de dias para renovação de assinatura',
          type: 'number',
          status: true,
          visible: true,
          createdBy: client.id.toString(),
        },
        {
          key: 'subscription.price',
          value: '10.00',
          keyInfo: 'Preço da assinatura',
          type: 'number',
          status: true,
          visible: true,
          createdBy: client.id.toString(),
        },
      ],
    })

    const subscription = await subscriptionFactory.makePrismaSubscription({
      createdBy: new UniqueEntityID(client.id.toString()),
      companyId: new UniqueEntityID(company.id.toString()),
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    })
    const response = await request(app.getHttpServer())
      .put(`/subscriptions`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        subscriptionId: subscription.id.toString(),
      })
    expect(response.status).toBe(200)

    const subscriptionOnDatabase = await prisma.subscription.findFirst({
      where: {
        id: subscription.id.toString(),
      },
    })
    expect(subscriptionOnDatabase).toBeTruthy()
  })
})
