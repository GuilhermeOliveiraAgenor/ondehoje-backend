import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

export interface FindManyCompaniesParams {
  latitude?: number
  longitude?: number
}

export abstract class CompaniesRepository {
  abstract findById(id: string): Promise<Company | null>
  abstract findBySlug(slug: string): Promise<CompanyDetails | null>
  abstract findMany(params?: FindManyCompaniesParams): Promise<CompanyDetails[]>
  abstract findManyForUser(
    userId: string,
    params?: FindManyCompaniesParams,
  ): Promise<CompanyDetails[]>

  abstract findManyByOwnerId(ownerId: string): Promise<Company[]>
  abstract create(company: Company): Promise<void>
  abstract save(company: Company): Promise<void>
}
