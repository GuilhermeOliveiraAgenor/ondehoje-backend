import { UseCaseError } from '@/core/errors/use-case-error'

export class SubscriptionStillActiveError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'A assinatura ainda está ativa. Não é necessário renová-la neste momento.',
    )
  }
}
