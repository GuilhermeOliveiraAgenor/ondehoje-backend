import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user as IdentityDetails
  },
)
