import { Injectable } from '@nestjs/common'

import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import { AdvertisementAuthorizationStatus } from '@/domain/ondehoje/application/modules/advertisement-authorization/enums/advertisement-authorization-status'
import {
  CompaniesRepository,
  type FindManyCompaniesParams,
} from '@/domain/ondehoje/application/modules/company/repositories/companies-repository'
import { CompanyDocumentsRepository } from '@/domain/ondehoje/application/modules/company-document/repositories/company-documents-repository'
import { CompanyImagesRepository } from '@/domain/ondehoje/application/modules/company-image/repositories/company-images-repository'
import { getDistanceBetweenCoordinates } from '@/domain/ondehoje/application/utils/get-distance-between-coordinates'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { PrismaCompanyDetailsMapper } from '../mappers/prisma-company-details-mapper'
import { PrismaCompanyMapper } from '../mappers/prisma-company-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(
    private prisma: PrismaService,
    private companyImagesRepository: CompanyImagesRepository,
    private companyDocumentsRepository: CompanyDocumentsRepository,
  ) {}

  async findById(id: string): Promise<Company | null> {
    const [company] = await this.prisma.$transaction([
      this.prisma.company.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async findBySlug(slug: string): Promise<CompanyDetails | null> {
    const [company] = await this.prisma.$transaction([
      this.prisma.company.findUnique({
        where: {
          slug,
        },
        include: {
          address: true,
          companyDocuments: {
            include: {
              document: true,
            },
          },
          companyImages: {
            include: {
              image: true,
            },
          },
          informations: {
            where: {
              eventId: null,
            },
          },
        },
      }),
    ])

    if (!company) {
      return null
    }

    return PrismaCompanyDetailsMapper.toDomain(company)
  }

  async findMany(params?: FindManyCompaniesParams): Promise<CompanyDetails[]> {
    const now = new Date()
    const { latitude, longitude } = params || {}

    const companies = await this.prisma.company.findMany({
      where: {
        advertisements: {
          some: {
            status: AdvertisementStatus.ACTIVE,
            expirationDate: {
              gt: now,
            },
            advertisementAuthorizations: {
              some: {
                status: AdvertisementAuthorizationStatus.AUTHORIZED,
              },
            },
            eventId: null,
          },
        },
      },
      include: {
        address: true,
        companyDocuments: {
          include: {
            document: true,
          },
        },
        companyImages: {
          include: {
            image: true,
          },
        },
        informations: {
          where: {
            eventId: null,
          },
        },
      },
    })

    if (latitude && longitude) {
      companies.sort((a, b) => {
        const distanceA = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: a.address.latitude.toNumber(),
            longitude: a.address.longitude.toNumber(),
          },
        )

        const distanceB = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: b.address.latitude.toNumber(),
            longitude: b.address.longitude.toNumber(),
          },
        )

        return distanceA - distanceB // Ordenação Crescente (menor distância primeiro)
      })
    }

    return companies.map(PrismaCompanyDetailsMapper.toDomain)
  }

  async findManyForUser(
    userId: string,
    params?: FindManyCompaniesParams,
  ): Promise<CompanyDetails[]> {
    const now = new Date()
    const { latitude, longitude } = params || {}

    const companies = await this.prisma.company.findMany({
      where: {
        advertisements: {
          some: {
            status: AdvertisementStatus.ACTIVE,
            expirationDate: {
              gt: now,
            },
            advertisementAuthorizations: {
              some: {
                status: AdvertisementAuthorizationStatus.AUTHORIZED,
              },
            },
            eventId: null,
          },
        },
      },
      include: {
        address: true,
        companyDocuments: {
          include: {
            document: true,
          },
        },
        companyImages: {
          include: {
            image: true,
          },
        },
        informations: {
          where: {
            eventId: null,
          },
        },
        favorites: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    })

    if (latitude && longitude) {
      companies.sort((a, b) => {
        const distanceA = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: a.address.latitude.toNumber(),
            longitude: a.address.longitude.toNumber(),
          },
        )

        const distanceB = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: b.address.latitude.toNumber(),
            longitude: b.address.longitude.toNumber(),
          },
        )

        return distanceA - distanceB // Ordenação Crescente (menor distância primeiro)
      })
    }

    return companies.map((company) =>
      PrismaCompanyDetailsMapper.toDomain({
        ...company,
        isFavorited: company.favorites.length > 0,
      }),
    )
  }

  async findManyByOwnerId(ownerId: string): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        createdBy: ownerId,
      },
    })

    return companies.map(PrismaCompanyMapper.toDomain)
  }

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPersistency(company)

    await this.prisma.$transaction([
      this.prisma.company.create({
        data,
      }),
    ])

    await this.companyImagesRepository.createMany(company.images.getItems())
    await this.companyDocumentsRepository.createMany(
      company.documents.getItems(),
    )
  }

  async save(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPersistency(company)

    await Promise.all([
      this.prisma.company.update({
        where: {
          id: company.id.toString(),
        },
        data,
      }),
      this.companyImagesRepository.createMany(company.images.getNewItems()),
      this.companyImagesRepository.deleteMany(company.images.getRemovedItems()),
      this.companyDocumentsRepository.createMany(
        company.documents.getNewItems(),
      ),
      this.companyDocumentsRepository.deleteMany(
        company.documents.getRemovedItems(),
      ),
    ])
  }
}
