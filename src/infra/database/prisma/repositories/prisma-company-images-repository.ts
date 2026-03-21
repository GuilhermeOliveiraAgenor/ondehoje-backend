import { Injectable } from '@nestjs/common'

import { CompanyImagesRepository } from '@/domain/ondehoje/application/modules/company-image/repositories/company-images-repository'
import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'

import { PrismaCompanyImageMapper } from '../mappers/prisma-company-image-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCompanyImagesRepository implements CompanyImagesRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByCompanyId(companyId: string): Promise<CompanyImage[]> {
    const [companyImages] = await this.prisma.$transaction([
      this.prisma.companyImage.findMany({
        where: {
          companyId,
        },
      }),
    ])

    return companyImages.map(PrismaCompanyImageMapper.toDomain)
  }

  async createMany(images: CompanyImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const data = PrismaCompanyImageMapper.toPersistencyMany(images)

    await this.prisma.$transaction([this.prisma.companyImage.createMany(data)])
  }

  async deleteMany(images: CompanyImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const companyImagesToDelete = images.map((companyImage) => {
      return {
        companyId: companyImage.companyId.toString(),
        imageId: companyImage.imageId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.companyImage.deleteMany({
        where: {
          OR: companyImagesToDelete,
        },
      }),
    ])

    await this.prisma.$transaction([
      this.prisma.image.deleteMany({
        where: {
          id: {
            in: images.map((image) => image.imageId.toString()),
          },
        },
      }),
    ])
  }

  async deleteManyByCompanyId(companyId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.companyImage.deleteMany({
        where: {
          companyId,
        },
      }),
    ])
  }
}
