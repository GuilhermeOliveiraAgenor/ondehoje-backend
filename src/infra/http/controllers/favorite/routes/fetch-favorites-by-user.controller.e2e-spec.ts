import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { EventFactory } from 'test/factories/make-event'
import { FavoriteFactory } from 'test/factories/make-favorite'
import { ImageFactory } from 'test/factories/make-image'
import { InformationFactory } from 'test/factories/make-information'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch Favorite by UserId Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let favoriteFactory: FavoriteFactory
  let eventFactory: EventFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        CompanyFactory,
        AddressFactory,
        InformationFactory,
        ImageFactory,
        EventFactory,
        FavoriteFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    addressFactory = moduleRef.get(AddressFactory)
    favoriteFactory = moduleRef.get(FavoriteFactory)
    eventFactory = moduleRef.get(EventFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /favorite/userId', async () => {
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

    const category = await prisma.category.create({
      data: {
        name: 'Categoria iuiopiuiiu',
        description: 'Descrição',
        createdBy: client.id.toString(),
      },
    })

    const event = await eventFactory.makePrismaEvent({
      companyId: new UniqueEntityID(company.id.toString()),
      addressId: new UniqueEntityID(address.id.toString()),
      categoryId: new UniqueEntityID(category.id.toString()),
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    await favoriteFactory.makePrismaFavorite({
      companyId: new UniqueEntityID(company.id.toString()),
      userId: new UniqueEntityID(client.id.toString()),
    })

    await favoriteFactory.makePrismaFavorite({
      eventId: new UniqueEntityID(event.id.toString()),
      userId: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .get('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    const favoriteOnDatabase = await prisma.favorite.findMany({
      where: {
        userId: client.id.toString(),
      },
    })

    expect(favoriteOnDatabase.length).toBeGreaterThan(0)
  })
})
