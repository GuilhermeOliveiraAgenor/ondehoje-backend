import { ClientsRepository } from '@/domain/ondehoje/application/modules/client/repositories/clients-repository'
import { Client } from '@/domain/ondehoje/enterprise/entities/client'

import type { InMemoryImagesRepository } from './in-memory-images-repository'
import type { InMemoryUserImagesRepository } from './in-memory-user-images-repository'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  constructor(
    private imagesRepository: InMemoryImagesRepository,
    private userImagesRepository: InMemoryUserImagesRepository,
  ) {}

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.id.toString() === id)

    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Client) {
    this.items.push(client)

    await this.userImagesRepository.createMany(client.images.getItems())
  }

  async save(client: Client): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === client.id)

    this.items[itemIndex] = client

    await this.userImagesRepository.createMany(client.images.getNewItems())
    await this.userImagesRepository.deleteMany(client.images.getRemovedItems())
  }
}
