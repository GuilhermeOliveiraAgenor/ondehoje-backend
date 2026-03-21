import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { CompanyDocument } from '@/domain/ondehoje/enterprise/entities/company-document'
import { CompanyDocumentList } from '@/domain/ondehoje/enterprise/entities/company-document-list'
import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'
import { CompanyImageList } from '@/domain/ondehoje/enterprise/entities/company-image-list'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { AddressesRepository } from '../../address/repositories/addresses-repository'
import { ClientsRepository } from '../../client/repositories/clients-repository'
import { InformationsRepository } from '../../information/repositories/informations-repository'
import { SubscriptionStatus } from '../../subscription/enum/subscription-status'
import { SubscriptionsRepository } from '../../subscription/repositories/subscriptions-repository'
import { CompanyStatus } from '../enums/company-status'
import { CompaniesRepository } from '../repositories/companies-repository'

interface CreateCompanyUseCaseRequest {
  addressId: string
  name: Company['name']
  socialName: Company['socialName']
  document: Company['document']
  documentsIds: string[]
  imagesIds: string[]
  informations?: Array<{
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
  createdBy: Company['createdBy']
}

type CreateCompanyUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private clientsRepository: ClientsRepository,
    private companiesRepository: CompaniesRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private informationsRepository: InformationsRepository,
  ) {}

  async execute({
    addressId,
    name,
    socialName,
    document,
    documentsIds,
    imagesIds,
    informations,
    createdBy,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)

    if (!address) {
      return failure(new ResourceNotFoundError('Address'))
    }

    const client = await this.clientsRepository.findById(createdBy.toString())

    if (!client) {
      return failure(new ResourceNotFoundError('Client'))
    }

    if (address.createdBy.toString() !== client.id.toString()) {
      return failure(new NotAllowedError())
    }

    const company = Company.create({
      addressId: address.id,
      name,
      socialName,
      status: CompanyStatus.ACTIVE,
      document,
      createdBy,
    })

    const companyDocuments = documentsIds.map((documentId) => {
      return CompanyDocument.create({
        companyId: company.id,
        documentId: new UniqueEntityID(documentId),
      })
    })

    company.documents = new CompanyDocumentList(companyDocuments)

    const companyImages = imagesIds.map((imageId) => {
      return CompanyImage.create({
        companyId: company.id,
        imageId: new UniqueEntityID(imageId),
      })
    })

    company.images = new CompanyImageList(companyImages)

    await this.companiesRepository.create(company)

    const sevenDaysFreePlan = new Date(
      new Date().setDate(new Date().getDate() + 7),
    )

    const subscription = Subscription.create({
      companyId: company.id,
      startDate: new Date(),
      endDate: sevenDaysFreePlan,
      status: SubscriptionStatus.TRIAL,
      amount: 0,
      createdBy,
    })

    await this.subscriptionsRepository.create(subscription)

    if (informations) {
      const informationsToCreate = informations.map((info) => {
        return Information.create({
          companyId: company.id,
          name: info.name,
          description: info.description ?? '',
          phoneNumber: info.phoneNumber ?? '',
          email: info.email ?? '',
          createdBy,
        })
      })

      await this.informationsRepository.createMany(informationsToCreate)
    }

    return success(null)
  }
}
