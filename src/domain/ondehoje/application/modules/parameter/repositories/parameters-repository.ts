import type { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

export abstract class ParametersRepository {
  abstract findById(id: string): Promise<Parameter | null>
  abstract findByKey(key: string): Promise<Parameter | null>
  abstract findMany(): Promise<Parameter[]>
  abstract create(parameter: Parameter): Promise<void>
  abstract save(parameter: Parameter): Promise<void>
}
