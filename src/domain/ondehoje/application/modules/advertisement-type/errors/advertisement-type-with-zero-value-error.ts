import { UseCaseError } from '@/core/errors/use-case-error'

export class AdvertisementTypeWithZeroValue
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Advertisement Type "${identifier}" with zero value.`)
  }
}
