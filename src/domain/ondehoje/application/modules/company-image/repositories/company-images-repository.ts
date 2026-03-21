import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'

export abstract class CompanyImagesRepository {
  abstract findManyByCompanyId(companyId: string): Promise<CompanyImage[]>
  abstract createMany(images: CompanyImage[]): Promise<void>
  abstract deleteMany(images: CompanyImage[]): Promise<void>
  abstract deleteManyByCompanyId(companyId: string): Promise<void>
}
