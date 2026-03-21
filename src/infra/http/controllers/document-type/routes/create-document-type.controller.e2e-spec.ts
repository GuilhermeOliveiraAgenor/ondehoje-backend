import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { DocumentTypeFactory } from 'test/factories/make-document-type'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Document type Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, DocumentTypeFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /companydocumentype', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const response = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Alvara',
        description: 'Documento de alvara',
      })

    expect(response.statusCode).toBe(201)

    const DocumentTypeOnDatabase =
      await prisma.documentType.findFirst({
        where: {
          name: 'Alvara',
          description: 'Documento de alvara',
        },
      })

    expect(DocumentTypeOnDatabase).toBeTruthy()
  })
})
