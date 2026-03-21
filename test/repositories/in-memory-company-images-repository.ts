import { CompanyImagesRepository } from '@/domain/ondehoje/application/modules/company-image/repositories/company-images-repository'
import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'

export class InMemoryCompanyImagesRepository
  implements CompanyImagesRepository
{
  public items: CompanyImage[] = []

  async findManyByCompanyId(companyId: string): Promise<CompanyImage[]> {
    const companyImages = this.items.filter(
      (item) => item.companyId.toString() === companyId,
    )

    return companyImages
  }

  async createMany(images: CompanyImage[]): Promise<void> {
    this.items.push(...images)
  }

  async deleteMany(images: CompanyImage[]): Promise<void> {
    const companyImages = this.items.filter((item) => {
      return !images.some((image) => image.equals(item))
    })

    this.items = companyImages
  }

  async deleteManyByCompanyId(companyId: string): Promise<void> {
    const companyImages = this.items.filter(
      (item) => item.companyId.toString() !== companyId,
    )

    this.items = companyImages
  }
}
