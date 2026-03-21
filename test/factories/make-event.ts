import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Event, EventProps } from '@/domain/ondehoje/enterprise/entities/event'
import { PrismaEventMapper } from '@/infra/database/prisma/mappers/prisma-event-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeEvent(
  override: Partial<EventProps> = {},
  id?: UniqueEntityID,
) {
  const event = Event.create(
    {
      companyId: new UniqueEntityID(),
      addressId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      name: faker.person.fullName(),
      startDate: faker.date.soon(),
      endDate: faker.date.soon({ days: 5 }),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return event
}

@Injectable()
export class EventFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEvent(data: Partial<EventProps> = {}): Promise<Event> {
    const event = makeEvent(data)

    await this.prisma.event.create({
      data: PrismaEventMapper.toPersistency(event),
    })

    return event
  }
}
