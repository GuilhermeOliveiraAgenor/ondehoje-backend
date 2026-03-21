import type { UseCaseError } from '@/core/errors/use-case-error'

export class EventEndDateBeforeStartDateError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'A nova data de término não pode ser menor ou igual à data de início.',
    )
  }
}
