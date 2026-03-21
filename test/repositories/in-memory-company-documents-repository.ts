import { CompanyDocumentsRepository } from '@/domain/ondehoje/application/modules/company-document/repositories/company-documents-repository'
import { CompanyDocument } from '@/domain/ondehoje/enterprise/entities/company-document'

export class InMemoryCompanyDocumentsRepository
  implements CompanyDocumentsRepository
{
  public items: CompanyDocument[] = []

  async createMany(documents: CompanyDocument[]): Promise<void> {
    this.items.push(...documents)
  }

  async deleteMany(documents: CompanyDocument[]): Promise<void> {
    const companyDocuments = this.items.filter((item) => {
      return !documents.some((document) => document.equals(item))
    })

    this.items = companyDocuments
  }

  async findManyByCompanyId(companyId: string): Promise<CompanyDocument[]> {
    const companyDocuments = this.items.filter(
      (item) => item.companyId.toString() === companyId,
    )

    return companyDocuments
  }

  async deleteManyByCompanyId(companyId: string): Promise<void> {
    const companyDocuments = this.items.filter(
      (item) => item.companyId.toString() !== companyId,
    )

    this.items = companyDocuments
  }
}
