import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

export class IdentityPresenter {
  static toHTTP(raw: IdentityDetails) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      birthDate: raw.birthDate,
      provider: raw.provider,
      image: raw.image,
      createdAt: raw.createdAt,
      roles: Array.from(raw.roles),
      permissions: Array.from(raw.permissions),
    }
  }
}
