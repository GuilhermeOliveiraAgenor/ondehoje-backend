import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { CompanyDocumentFactory } from 'test/factories/make-company-document'
import { CompanyImageFactory } from 'test/factories/make-company-image'
import { DocumentTypeFactory } from 'test/factories/make-document-type'
import { ImageFactory } from 'test/factories/make-image'
import { InformationFactory } from 'test/factories/make-information'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Company Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let companyDocumentFactory: CompanyDocumentFactory
  let companyImageFactory: CompanyImageFactory
  let documentTypeFactory: DocumentTypeFactory
  let informationFactory: InformationFactory
  let imageFactory: ImageFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        CompanyFactory,
        AddressFactory,
        CompanyDocumentFactory,
        CompanyImageFactory,
        DocumentTypeFactory,
        InformationFactory,
        ImageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    addressFactory = moduleRef.get(AddressFactory)
    documentTypeFactory = moduleRef.get(DocumentTypeFactory)
    companyDocumentFactory = moduleRef.get(CompanyDocumentFactory)
    companyImageFactory = moduleRef.get(CompanyImageFactory)
    informationFactory = moduleRef.get(InformationFactory)
    imageFactory = moduleRef.get(ImageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /company', async () => {
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
      name: 'Cia Verde Logística',
      socialName: 'Cia Verde',
      document: '98988989',
      createdBy: new UniqueEntityID(client.id.toString()),
      status: CompanyStatus.ACTIVE,
    })

    const documentType = await documentTypeFactory.makePrismaDocumentType({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const document = await companyDocumentFactory.makePrismaCompanyDocument({
      companyId: company.id,
      documentTypeId: documentType.id,
      file: 'Documento.pdf',
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const image = await imageFactory.makePrismaImage()

    await companyImageFactory.makePrismaCompanyImage({
      companyId: company.id,
      imageId: image.id,
    })

    const information = await informationFactory.makePrismaInformation({
      companyId: company.id,
      eventId: null,
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .post('/companies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        addressId: address.id.toString(),
        name: company.name,
        socialName: company.socialName,
        document: company.document,
        documentsIds: [document.id.toString()],
        imageIds: [image.id.toString()],
        informations: [
          {
            name: information.name,
            description: information.description,
            phoneNumber: information.phoneNumber,
            email: information.email,
          },
        ],
      })

    expect(response.status).toBe(201)

    const companyOnDatabase = await prisma.company.findFirst({
      where: { name: 'Cia Verde Logística' },
    })
    expect(companyOnDatabase).toBeTruthy()
  })
})
