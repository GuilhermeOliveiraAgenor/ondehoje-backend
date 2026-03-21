import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { DocumentTypeFactory } from 'test/factories/make-document-type'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('List Document type By Id Use Case', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let documentTypeFactory: DocumentTypeFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, DocumentTypeFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    documentTypeFactory = moduleRef.get(DocumentTypeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /companydocumentype', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    await documentTypeFactory.makePrismaDocumentType({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .get('/document-types')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.documentTypes.length).toBeGreaterThan(0)

    const documentTypeOnDatabase = await prisma.documentType.findMany()

    expect(documentTypeOnDatabase.length).toBeGreaterThan(0)
  })
})
