import { CompaniesRepository } from '@/domain/ondehoje/application/modules/company/repositories/companies-repository'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { InMemoryAddressesRepository } from './in-memory-addresses-repository'
import { InMemoryCompanyDocumentsRepository } from './in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from './in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from './in-memory-documents-repository'
import { InMemoryFavoritesRepository } from './in-memory-favorites-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryInformationsRepository } from './in-memory-informations-repository'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = []

  constructor(
    private addressesRepository: InMemoryAddressesRepository,
    private documentsRepository: InMemoryDocumentsRepository,
    private companyDocumentsRepository: InMemoryCompanyDocumentsRepository,
    private imagesRepository: InMemoryImagesRepository,
    private companyImagesRepository: InMemoryCompanyImagesRepository,
    private informationsRepository: InMemoryInformationsRepository,
    private favoritesRepository: InMemoryFavoritesRepository,
  ) {}

  async findById(id: string): Promise<Company | null> {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async findBySlug(slug: string): Promise<CompanyDetails | null> {
    const company = this.items.find((item) => item.slug.value === slug)

    if (!company) {
      return null
    }

    const address = this.addressesRepository.items.find(
      (address) => address.id.toString() === company.addressId.toString(),
    )

    if (!address) {
      return null
    }

    const companyDocuments = this.companyDocumentsRepository.items.filter(
      (companyDocument) => companyDocument.companyId === company.id,
    )

    const documents = this.documentsRepository.items
      .filter((document) =>
        companyDocuments.some(
          (eventDocument) =>
            eventDocument.documentId.toString() === document.id.toString(),
        ),
      )
      .map((document) => {
        return Document.create({
          documentTypeId: document.documentTypeId,
          file: document.file,
          name: document.name,
          description: document.description,
          expiresAt: document.expiresAt,
          createdAt: document.createdAt,
          createdBy: document.createdBy,
          updatedAt: document.updatedAt,
          updatedBy: document.updatedBy,
        })
      })

    const companyImages = this.companyImagesRepository.items.filter(
      (companyImage) => companyImage.companyId === company.id,
    )

    const images = this.imagesRepository.items
      .filter((image) =>
        companyImages.some(
          (eventImage) => eventImage.imageId.toString() === image.id.toString(),
        ),
      )
      .map((image) => {
        return Image.create({
          url: image.url,
          alt: image.alt,
          createdAt: image.createdAt,
        })
      })

    const informations = this.informationsRepository.items.filter(
      (information) =>
        information.companyId?.toString() === company.id.toString() &&
        !information.eventId,
    )

    const favorite = this.favoritesRepository.items.find(
      (favorite) => favorite.companyId?.toString() === company.id.toString(),
    )

    return CompanyDetails.create({
      id: company.id,
      name: company.name,
      slug: company.slug,
      socialName: company.socialName,
      status: company.status,
      document: company.document,
      createdAt: company.createdAt,
      createdBy: company.createdBy,
      updatedAt: company.updatedAt,
      updatedBy: company.updatedBy,
      address,
      documents,
      images,
      informations,
      isFavorited: !!favorite,
    })
  }

  async findMany(): Promise<CompanyDetails[]> {
    throw new Error('Method not implemented.')
  }

  async findManyForUser(): Promise<CompanyDetails[]> {
    throw new Error('Method not implemented.')
  }

  async findManyByOwnerId(ownerId: string): Promise<Company[]> {
    const companies = this.items.filter(
      (item) => item.createdBy.toString() === ownerId,
    )

    return companies
  }

  async create(company: Company): Promise<void> {
    this.items.push(company)

    await this.companyDocumentsRepository.createMany(
      company.documents.getItems(),
    )

    await this.companyImagesRepository.createMany(company.images.getItems())
  }

  async save(company: Company): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === company.id)

    this.items[itemIndex] = company

    await this.companyDocumentsRepository.createMany(
      company.documents.getNewItems(),
    )
    await this.companyDocumentsRepository.deleteMany(
      company.documents.getRemovedItems(),
    )

    await this.companyImagesRepository.createMany(company.images.getNewItems())
    await this.companyImagesRepository.deleteMany(
      company.images.getRemovedItems(),
    )
  }
}
