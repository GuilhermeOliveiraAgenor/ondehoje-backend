import { Either, failure, success } from '@/core/either'

import { Encrypter } from '../../../cryptography/encrypter'
import { HashComparer } from '../../../cryptography/hash-comparer'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { ClientsRepository } from '../repositories/clients-repository'

interface AuthenticateClientUseCaseRequest {
  email: string
  password: string
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email)

    if (!client) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
    })

    return success({
      accessToken,
    })
  }
}
