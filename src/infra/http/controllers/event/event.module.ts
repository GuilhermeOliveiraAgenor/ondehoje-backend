import { Module } from '@nestjs/common'

import { CreateEventUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/create-event'
import { EditEventUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/edit-event'
import { FetchEventsUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events'
import { FetchEventsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events-by-company-slug'
import { FetchEventsForUserUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events-for-user'
import { GetEventBySlugUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/get-event-by-slug'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateEventController } from './routes/create-event.controller'
import { EditEventController } from './routes/edit-event.controller'
import { FetchEventsController } from './routes/fetch-events.controller'
import { FetchEventsByCompanySlugController } from './routes/fetch-events-by-company-slug.controller'
import { FetchEventsForUserController } from './routes/fetch-events-for-user.controller'
import { GetEventBySlugController } from './routes/get-event-by-slug.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateEventController,
    FetchEventsByCompanySlugController,
    FetchEventsController,
    EditEventController,
    FetchEventsController,
    GetEventBySlugController,
    FetchEventsForUserController,
  ],
  providers: [
    CreateEventUseCase,
    FetchEventsByCompanySlugUseCase,
    FetchEventsUseCase,
    EditEventUseCase,
    FetchEventsUseCase,
    GetEventBySlugUseCase,
    FetchEventsForUserUseCase,
  ],
})
export class HttpEventModule {}
