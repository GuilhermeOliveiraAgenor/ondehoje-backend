import { UseCaseError } from '@/core/errors/use-case-error'

export class AdvertisementTypeWithSameNameError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Advertisement Type "${identifier}" already exists.`)
  }
}
