import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('List Category Controller (e2e) By Id Use Case', () => {
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

  test('[GET] /category', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    await prisma.category.create({
      data: {
        name: 'Bares iuioi',
        description: 'Categoria de bares',
        createdBy: client.id.toString(),
      },
    })

    const response = await request(app.getHttpServer())
      .get('/categories')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.categories.length).toBeGreaterThan(0)

    const categoriesOnDatabase = await prisma.category.findMany()
    expect(categoriesOnDatabase.length).toBeGreaterThan(0)
  })
})
