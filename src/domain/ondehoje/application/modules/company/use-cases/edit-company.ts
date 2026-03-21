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

import { AddressesRepository } from '../../address/repositories/addresses-repository'
import { AdvertisementStatus } from '../../advertisement/enums/advertisement-status'
import { AdvertisementsRepository } from '../../advertisement/repositories/advertisements-repository'
import { CompanyDocumentsRepository } from '../../company-document/repositories/company-documents-repository'
import { CompanyImagesRepository } from '../../company-image/repositories/company-images-repository'
import { InformationsRepository } from '../../information/repositories/informations-repository'
import { CompaniesRepository } from '../repositories/companies-repository'

interface EditCompanyUseCaseRequest {
  id: string
  addressId?: string
  name?: Company['name']
  socialName?: Company['socialName']
  document?: Company['document']
  informations?: Array<{
    id?: string
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
  imagesIds?: string[]
  documentsIds?: string[]
  updatedBy: string
}

type EditCompanyUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class EditCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private addressesRepository: AddressesRepository,
    private informationsRepository: InformationsRepository,
    private companyImagesRepository: CompanyImagesRepository,
    private companyDocumentsRepository: CompanyDocumentsRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    id,
    addressId,
    name,
    socialName,
    document,
    informations,
    imagesIds,
    documentsIds,
    updatedBy,
  }: EditCompanyUseCaseRequest): Promise<EditCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    if (company.createdBy.toString() !== updatedBy) {
      return failure(new NotAllowedError())
    }

    if (addressId && company.addressId.toString() !== addressId) {
      const address = await this.addressesRepository.findById(addressId)

      if (!address) {
        return failure(new ResourceNotFoundError('Address'))
      }

      company.addressId = address.id
    }

    if (informations) {
      const currentInformations =
        await this.informationsRepository.findManyByCompanyId(id)

      const informationsToDelete = currentInformations.filter((info) => {
        return !informations.some((i) => i.id === info.id.toString())
      })

      for (const information of informationsToDelete) {
        await this.informationsRepository.delete(information)
      }

      const informationsToCreate = informations.filter((info) => !info.id)

      const newInformations = informationsToCreate.map((info) => {
        return Information.create({
          name: info.name,
          description: info.description,
          phoneNumber: info.phoneNumber,
          email: info.email,
          companyId: company.id,
          createdBy: new UniqueEntityID(updatedBy),
        })
      })

      await this.informationsRepository.createMany(newInformations)

      const informationsToUpdate = informations.filter((info) => info.id)

      for (const information of informationsToUpdate) {
        const existingInformation = currentInformations.find(
          (i) => i.id.toString() === information.id,
        )

        if (existingInformation) {
          existingInformation.name = information.name
          existingInformation.description = information.description ?? null
          existingInformation.phoneNumber = information.phoneNumber ?? null
          existingInformation.email = information.email ?? null
          existingInformation.updatedBy = new UniqueEntityID(updatedBy)

          await this.informationsRepository.save(existingInformation)
        }
      }
    }

    if (imagesIds) {
      const currentCompanyImages =
        await this.companyImagesRepository.findManyByCompanyId(id)

      const companyImagesList = new CompanyImageList(currentCompanyImages)

      const companyImages = imagesIds.map((imageId) => {
        return CompanyImage.create({
          imageId: new UniqueEntityID(imageId),
          companyId: company.id,
        })
      })

      companyImagesList.update(companyImages)
      company.images = companyImagesList
    }

    if (documentsIds) {
      const currentCompanyDocuments =
        await this.companyDocumentsRepository.findManyByCompanyId(id)

      const companyDocumentsList = new CompanyDocumentList(
        currentCompanyDocuments,
      )

      const companyDocuments = documentsIds.map((documentId) => {
        return CompanyDocument.create({
          documentId: new UniqueEntityID(documentId),
          companyId: company.id,
        })
      })

      companyDocumentsList.update(companyDocuments)
      company.documents = companyDocumentsList
    }

    company.name = name ?? company.name
    company.socialName = socialName ?? company.socialName
    company.document = document ?? company.document
    company.updatedBy = new UniqueEntityID(updatedBy)

    await this.companiesRepository.save(company)

    const hasAdvertisement =
      await this.advertisementsRepository.findFirstByCompanyId(id)

    if (hasAdvertisement) {
      hasAdvertisement.status = AdvertisementStatus.WAITING_AUTHORIZATION

      await this.advertisementsRepository.save(hasAdvertisement)
    }

    return success(null)
  }
}
