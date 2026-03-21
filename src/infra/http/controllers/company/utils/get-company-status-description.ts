import { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'

export function getCompanyStatusDescription(status: string): string {
  const keys = {
    [CompanyStatus.ACTIVE]: 'Ativa',
    [CompanyStatus.INACTIVE]: 'Desativada',
  }

  const key = keys[status]

  return key
}
