import { CompanyDocument } from '@/domain/ondehoje/enterprise/entities/company-document'

export abstract class CompanyDocumentsRepository {
  abstract findManyByCompanyId(companyId: string): Promise<CompanyDocument[]>
  abstract createMany(documents: CompanyDocument[]): Promise<void>
  abstract deleteMany(documents: CompanyDocument[]): Promise<void>
  abstract deleteManyByCompanyId(companyId: string): Promise<void>
}
