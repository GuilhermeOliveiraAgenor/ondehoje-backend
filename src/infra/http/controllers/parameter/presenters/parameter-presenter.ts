import { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

export class ParameterPresenter {
  static toHTTP(raw: Parameter) {
    return {
      key: raw.key,
      keyInfo: raw.keyInfo,
      value: raw.value,
      type: raw.type,
      status: raw.status,
      visible: raw.visible,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
