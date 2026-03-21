import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Category Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /category', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Bares',
        description: 'Categoria de bares e pubs',
      })

    expect(response.statusCode).toBe(201)

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        name: 'Bares',
      },
    })

    expect(categoryOnDatabase).toBeTruthy()
  })
})
