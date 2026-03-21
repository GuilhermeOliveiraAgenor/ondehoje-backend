import { Client } from '@/domain/ondehoje/enterprise/entities/client'

export abstract class ClientsRepository {
  abstract findById(id: string): Promise<Client | null>
  abstract findByEmail(email: string): Promise<Client | null>
  abstract create(client: Client): Promise<void>
  abstract save(client: Client): Promise<void>
}
