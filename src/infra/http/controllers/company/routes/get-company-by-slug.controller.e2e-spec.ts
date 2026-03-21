import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
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
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Company Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let companyImageFactory: CompanyImageFactory
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
    companyImageFactory = moduleRef.get(CompanyImageFactory)
    informationFactory = moduleRef.get(InformationFactory)
    imageFactory = moduleRef.get(ImageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })
  test('[GET] /company/:slug', async () => {
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const address = await addressFactory.makePrismaAddress({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const uniqueSlug = Slug.create(`cia-verde-logistica-${randomUUID()}`)

    const company = await companyFactory.makePrismaCompany({
      addressId: address.id,
      name: 'Cia Verde Logística uiouo',
      socialName: 'Cia Verde',
      document: '98988989',
      slug: uniqueSlug,
      createdBy: new UniqueEntityID(client.id.toString()),
      status: CompanyStatus.ACTIVE,
    })

    const image = await imageFactory.makePrismaImage()

    await companyImageFactory.makePrismaCompanyImage({
      companyId: company.id,
      imageId: image.id,
    })

    await informationFactory.makePrismaInformation({
      companyId: company.id,
      eventId: null,
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .get(`/companies/${company.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    const companyOnDatabase = await prisma.company.findFirst({
      where: { name: 'Cia Verde Logística uiouo' },
    })
    expect(companyOnDatabase).toBeTruthy()
  })
})
