import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MissingRequiredParametersError } from '@/core/errors/missing-required-parameters-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { FavoritesRepository } from '../repositories/favorites-repository'

interface ToggleFavoriteUseCaseRequest {
  userId: string
  eventId?: string
  companyId?: string
}

type ToggleFavoriteUseCaseResponse = Either<
  MissingRequiredParametersError | ResourceNotFoundError,
  null
>

@Injectable()
export class ToggleFavoriteUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private eventsRepository: EventsRepository,
    private favoritesRepository: FavoritesRepository,
  ) {}

  async execute({
    userId,
    companyId,
    eventId,
  }: ToggleFavoriteUseCaseRequest): Promise<ToggleFavoriteUseCaseResponse> {
    if (!companyId && !eventId) {
      return failure(
        new MissingRequiredParametersError(['CompanyId', 'EventId']),
      )
    }

    let event: Event | null = null
    let company: Company | null = null

    if (eventId) {
      event = await this.eventsRepository.findById(eventId)

      if (!event) {
        return failure(new ResourceNotFoundError('Event'))
      }
    }

    if (companyId) {
      company = await this.companiesRepository.findById(companyId)

      if (!company) {
        return failure(new ResourceNotFoundError('Company'))
      }
    }

    const existingFavorites =
      await this.favoritesRepository.findMyFavorites(userId)

    const favoriteToToggle = existingFavorites.find((favorite) => {
      if (eventId && favorite.eventId?.toString() === eventId) {
        return true
      }

      if (companyId && favorite.companyId?.toString() === companyId) {
        return true
      }

      return false
    })

    if (favoriteToToggle) {
      await this.favoritesRepository.delete(favoriteToToggle)
    } else {
      const favorite = Favorite.create({
        userId: new UniqueEntityID(userId),
        eventId: event ? event.id : null,
        companyId: company ? company.id : null,
      })

      await this.favoritesRepository.create(favorite)
    }

    return success(null)
  }
}
