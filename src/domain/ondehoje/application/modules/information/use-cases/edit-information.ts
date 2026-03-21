import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

import { InformationsRepository } from '../repositories/informations-repository'

interface EditInformationUseCaseRequest {
  informationId: string
  name: string
  description: string
  phoneNumber: string
  email: string
  updatedBy: string
}

type EditInformationUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    information: Information
  }
>
@Injectable()
export class EditInformationUseCase {
  constructor(private informationsRepository: InformationsRepository) {}

  async execute({
    name,
    description,
    phoneNumber,
    email,
    informationId,
    updatedBy,
  }: EditInformationUseCaseRequest): Promise<EditInformationUseCaseResponse> {
    const information =
      await this.informationsRepository.findById(informationId)

    if (!information) {
      return failure(new ResourceNotFoundError(name))
    }

    information.name = name ?? information.name
    information.description = description ?? information.name
    information.phoneNumber = phoneNumber ?? information.phoneNumber
    information.email = email ?? information.email
    information.updatedBy = new UniqueEntityID(updatedBy)

    await this.informationsRepository.save(information)

    return success({
      information,
    })
  }
}
