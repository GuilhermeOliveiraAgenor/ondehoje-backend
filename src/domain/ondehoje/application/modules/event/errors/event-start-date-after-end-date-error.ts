import type { UseCaseError } from '@/core/errors/use-case-error'

export class EventStartDateAfterEndDateError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'A nova data de início não pode ser maior ou igual à data de término.',
    )
  }
}
