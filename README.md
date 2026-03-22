# 🚀 Onde Hoje

## 📌 About

O Onde Hoje é uma API desenvolvida como parte de um Trabalho de Conclusão de Curso (TCC), com foco em conectar usuários a eventos e estabelecimentos de entretenimento de forma inteligente, utilizando filtros, categorias e geolocalização.

A aplicação permite que usuários encontrem opções próximas com base na sua localização, enquanto empresas podem divulgar seus eventos e estabelecimentos dentro da plataforma.

A arquitetura foi projetada seguindo princípios de Clean Architecture e DDD (Domain-Driven Design), garantindo escalabilidade, organização e facilidade de manutenção.

💡 A monetização é realizada através de planos de divulgação pagos, integrados com Stripe, funcionando como sustentação da plataforma.

📄 Documentação completa do TCC (50+ páginas):
<br>
👉 [Ver documento](https://drive.google.com/file/d/1AV04oNaKpU44M1bavN1ACDR9V1wlY6sS/view?usp=sharing)


## ⚙️ Features

### 👤 Usuários
- Cadastro e login com Google (OAuth)

### 🔎 Exploração
- Pesquisa de eventos e estabelecimentos com filtros
- Geolocalização com Mapbox
- Listagem de resultados baseada na localização
- Visualização detalhada de eventos e estabelecimentos

### 💳 Pagamentos
- Integração com Stripe
Cobrança para divulgação de anúncios
Email com link de pagamento

### 🏢 Área do Assinante
- Cadastro e edição de eventos e estabelecimentos
- Criação e gerenciamento de anúncios
- Geração de cupons promocionais

### 🛡️ Moderação
- Validação de anúncios por administradores
- Controle de conteúdo publicado


## Documentação

A documentação completa do sistema inclui:

- Diagrama de tecnologias (pg 16 e 17)
- RFs, RNFs e User Stories (pg 19 a 26)
- Diagramas Entidade Relacionamento - DER (pg 27 a 36)
- Diagramas de Caso de Uso (pg 27 a 36)

📄 Acesse a documentação completa:
<br>
👉 [Documentação Onde Hoje](https://drive.google.com/file/d/1AV04oNaKpU44M1bavN1ACDR9V1wlY6sS/view?usp=sharing)


## 🏗️ Estrutura do Projeto

A API foi estruturada seguindo Clean Architecture + DDD, separando responsabilidades em camadas bem definidas

```
prisma
src
├── core
│   ├── errors
│   └── entities
├── domain
│   ├── identity-access
│   ├── notification
│   ├── ondehoje
│   │   ├── application
│   │   │   └── modules
│   │   │       └── class
│   │   │           ├── repositories
│   │   │           └── use-cases
│   │   └── enterprise
│   └── payment
├── infra
│   ├── auth
│   ├── database
│   ├── env
│   ├── http
│   └── payment
test
```

### Use Case (Application Layer)

Responsável por orquestrar a lógica da aplicação, coordenando entidades e repositórios para executar uma ação específica do sistema, mantendo as regras de negócio isoladas da infraestrutura.

```
@Injectable()
export class CreateEventUseCase {
constructor(
    private eventsRepository: EventsRepository,
  ) {}
  async execute(data: CreateEventUseCaseRequest) {

    const event = Event.create({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    })

    await this.eventsRepository.create(event)

    return success({ event })
  }
}
```


### Entity (Domain)

Representa o núcleo do domínio da aplicação, contendo atributos e comportamentos que garantem a consistência das regras de negócio.

```
export class Event extends Entity<EventProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  static create(props: EventProps, id?: UniqueEntityID) {
    return new Event(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
```

### Repository Interface

Define contratos abstratos para acesso a dados, permitindo desacoplar a lógica de negócio da implementação de persistência.

```
export abstract class EventsRepository {
  /*...*/
  abstract findById(id: string): Promise<Event | null>
  abstract create(event: Event): Promise<void>
}
```

### Controller

Camada de entrada da aplicação, responsável por receber requisições HTTP, validar dados e delegar a execução para os casos de uso.

```
@Controller('/')
export class CreateEventController {
  @Post()
  async handle(@Body() body, @CurrentUser() user) {
    const result = await this.createEvent.execute({
      ...body,
      createdBy: user.id.toString(),
    })

    if (result.isError()) {
      throw new BadRequestException()
    }
  }
}
```

### Module (NestJS DI)

Organiza e registra dependências da aplicação utilizando injeção de dependência do NestJS, conectando controllers, serviços e repositórios.

```
@Module({
  imports: [DatabaseModule],
  controllers: [CreateEventController],
  providers: [CreateEventUseCase],
})
export class HttpEventModule {}
```


