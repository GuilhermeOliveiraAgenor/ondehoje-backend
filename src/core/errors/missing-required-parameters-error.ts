import { UseCaseError } from '@/core/errors/use-case-error'

export class MissingRequiredParametersError
  extends Error
  implements UseCaseError
{
  constructor(parameterNames: string[] = []) {
    const formattedParameters = parameterNames.join(' ou ')

    super(
      `É necessário fornecer pelo menos um dos seguintes parâmetros: ${formattedParameters}.`,
    )
  }
}
