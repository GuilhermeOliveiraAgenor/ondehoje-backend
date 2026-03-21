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

describe('Edit Document type Controller (e2e)', () => {
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

  test('[PUT] /companydocumentype', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const documentType =
      await documentTypeFactory.makePrismaDocumentType({
        createdBy: new UniqueEntityID(client.id.toString()),
      })

    const response = await request(app.getHttpServer())
      .put(`/document-types/${documentType.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'CNPJ',
        description: 'Documento de CNPJ',
      })

    const DocumentTypeOnDatabase =
      await prisma.documentType.findFirst({
        where: {
          name: 'CNPJ',
          description: 'Documento de CNPJ',
        },
      })

    expect(response.statusCode).toBe(200)
    expect(DocumentTypeOnDatabase).toBeTruthy()
    expect(DocumentTypeOnDatabase).toMatchObject({
      name: 'CNPJ',
      description: 'Documento de CNPJ',
    })
  })
})
