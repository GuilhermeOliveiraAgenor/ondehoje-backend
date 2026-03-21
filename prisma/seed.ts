import { randomUUID } from 'node:crypto'

import { type Category, PrismaClient, User } from '@prisma/client'

import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import { AdvertisementAuthorizationStatus } from '@/domain/ondehoje/application/modules/advertisement-authorization/enums/advertisement-authorization-status'
import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import { PaymentStatus } from '@/domain/payment/application/enums/payment-status'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

import { PERMISSIONS, ROLES } from './permissions'
import { productionData } from './production-seed'

const prisma = new PrismaClient()
const bcryptHasher = new BcryptHasher()

async function main(): Promise<void> {
  const environment = process.env.NODE_ENV
  console.log(`Seeding database in ${environment} environment...`)

  if (environment === 'development') {
    console.log('Running Development Seed...')
    await seedDevelopment()
    console.log('Finished Development Seed...')
  } else if (environment === 'deploy') {
    console.log('Running Deploy Seed...')
    await seedDeploy()
    console.log('Finished Deploy Seed...')
  } else if (environment === 'production') {
    console.log('Running Production Seed...')
    await seedProduction()
    console.log('Finished Production Seed...')
  }
}

async function seedDevelopment(): Promise<void> {
  const { admin } = await createUsers()

  await createRolesAndPermissions({ admin })
  await createParameters({ admin })
  await createDocumentTypes({ admin })

  const categories = await createCategories({ admin })
  // await createDevelopmentData({ admin })
  await createProductionData({ admin, categories })
}

async function seedDeploy(): Promise<void> {
  const { admin } = await createUsers()

  await createRolesAndPermissions({ admin })
  await createDocumentTypes({ admin })
  await createParameters({ admin })

  const categories = await createCategories({ admin })
  await createProductionData({ admin, categories })
}

async function seedProduction(): Promise<void> {
  const { admin } = await createUsers()

  await createRolesAndPermissions({ admin })
  await createDocumentTypes({ admin })
  await createParameters({ admin })

  const categories = await createCategories({ admin })
  await createProductionData({ admin, categories })
}

async function createUsers(): Promise<{ admin: User }> {
  console.log('Running createUsers....')

  const hashedPassword = await bcryptHasher.hash('syscemitery')

  const admin = await prisma.user.upsert({
    where: {
      email: 'ondehoje.sac@gmail.com',
    },
    create: {
      name: 'Administrator',
      email: 'ondehoje.sac@gmail.com',
      provider: 'google',
      password: hashedPassword,
      birthDate: new Date('2000-01-01'),
    },
    update: {},
  })

  console.log('Finished createUsers....')

  return {
    admin,
  }
}

async function createRolesAndPermissions({
  admin,
}: {
  admin: User
}): Promise<void> {
  console.log('Running createRolesAndPermissions....')

  for (const roleName of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      create: { name: roleName },
      update: {},
    })

    await prisma.identityRole.upsert({
      where: {
        identityId_roleId: {
          identityId: admin.id,
          roleId: role.id,
        },
      },
      create: {
        identityId: admin.id,
        roleId: role.id,
      },
      update: {},
    })

    for (const permission of PERMISSIONS) {
      const perm = await prisma.permission.upsert({
        where: {
          action_entity: {
            action: permission.action,
            entity: permission.entity,
          },
        },
        create: {
          action: permission.action,
          entity: permission.entity,
        },
        update: {},
      })

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
        update: {},
      })
    }
  }

  console.log('Finished createRolesAndPermissions....')
}

async function createParameters({ admin }: { admin: User }): Promise<void> {
  console.log('Running createParameters....')

  // Subscriptions parameters
  await Promise.all([
    prisma.parameter.upsert({
      where: {
        key: 'subscription.price',
      },
      create: {
        key: 'subscription.price',
        keyInfo: 'subscription.price.info',
        value: '10',
        type: 'value',
        status: true,
        visible: false,
        createdBy: admin.id,
      },
      update: {},
    }),
    prisma.parameter.upsert({
      where: {
        key: 'subscription.renewal.days',
      },
      create: {
        key: 'subscription.renewal.days',
        keyInfo: 'subscription.renewal.days.info',
        value: '30',
        type: 'value',
        status: true,
        visible: false,
        createdBy: admin.id,
      },
      update: {},
    }),
  ])

  // Advertisement parameters
  await Promise.all([
    prisma.parameter.upsert({
      where: {
        key: 'advertisement.base.daily.price',
      },
      create: {
        key: 'advertisement.base.daily.price',
        keyInfo: 'advertisement.base.daily.price.info',
        value: '10',
        type: 'value',
        status: true,
        visible: false,
        createdBy: admin.id,
      },
      update: {},
    }),
    prisma.parameter.upsert({
      where: {
        key: 'advertisement.discount.threshold.days',
      },
      create: {
        key: 'advertisement.discount.threshold.days',
        keyInfo: 'advertisement.discount.threshold.days.info',
        value: '30',
        type: 'value',
        status: true,
        visible: false,
        createdBy: admin.id,
      },
      update: {},
    }),
    prisma.parameter.upsert({
      where: {
        key: 'advertisement.discount.percentage',
      },
      create: {
        key: 'advertisement.discount.percentage',
        keyInfo: 'advertisement.discount.percentage.info',
        value: '10',
        type: 'value',
        status: true,
        visible: false,
        createdBy: admin.id,
      },
      update: {},
    }),
  ])

  console.log('Finished createParameters....')
}

async function createDocumentTypes({ admin }: { admin: User }): Promise<void> {
  console.log('Running createDocumentTypes....')

  const documentTypes = [
    {
      name: 'CNPJ',
      description: 'Cadastro Nacional da Pessoa Jurídica',
    },
    {
      name: 'Inscrição Estadual',
      description: 'Número de inscrição estadual para empresas',
    },
    {
      name: 'Inscrição Municipal',
      description: 'Número de inscrição municipal para empresas',
    },
    {
      name: 'Alvará de Funcionamento',
      description: 'Documento que autoriza o funcionamento da empresa',
    },
  ]

  for (const docType of documentTypes) {
    await prisma.documentType.upsert({
      where: {
        name: docType.name,
      },
      create: {
        name: docType.name,
        description: docType.description,
        createdBy: admin.id,
      },
      update: {},
    })
  }

  console.log('Finished createDocumentTypes....')
}

async function createCategories({
  admin,
}: {
  admin: User
}): Promise<Category[]> {
  console.log('Running createCategories....')

  const data = [
    {
      name: 'Bares',
      description: 'Eventos em bares ou pubs.',
    },
    {
      name: 'Restaurantes',
      description:
        'Eventos gastronômicos em restaurantes, bistrôs e espaços culinários.',
    },
    {
      name: 'Formaturas',
      description: 'Eventos de formatura e celebrações acadêmicas.',
    },
    {
      name: 'Shows e Concertos',
      description: 'Apresentações musicais ao vivo e grandes shows.',
    },
    {
      name: 'Teatro e Cultura',
      description: 'Peças de teatro, apresentações culturais e performances.',
    },
    {
      name: 'Esportes',
      description: 'Eventos esportivos, campeonatos e atividades físicas.',
    },
    {
      name: 'Festivais',
      description: 'Festivais de música, gastronomia, cultura e arte.',
    },
    {
      name: 'Infantil',
      description: 'Eventos voltados para crianças e famílias.',
    },
    {
      name: 'Corporativo',
      description: 'Eventos empresariais, palestras, workshops e convenções.',
    },
    {
      name: 'Feiras e Exposições',
      description: 'Feiras temáticas, exposições de arte, negócios e produtos.',
    },
    {
      name: 'Cinema',
      description: 'Sessões especiais, estreias e mostras de cinema.',
    },
    {
      name: 'Religioso',
      description: 'Encontros, cultos e eventos religiosos.',
    },
    {
      name: 'Ao Ar Livre',
      description: 'Eventos em parques, praças, praias e ambientes externos.',
    },
    {
      name: 'Gastronômico',
      description:
        'Degustações, feiras gastronômicas e experiências culinárias.',
    },
    {
      name: 'Tecnologia',
      description:
        'Encontros, hackathons, meetups e lançamentos de tecnologia.',
    },
    {
      name: 'Moda e Beleza',
      description:
        'Desfiles, workshops e eventos relacionados à estética e moda.',
    },
    {
      name: 'Bem-Estar',
      description: 'Aulas, retiros e eventos voltados para saúde e bem-estar.',
    },
    {
      name: 'Pets',
      description:
        'Encontros, feiras e atividades voltadas para animais de estimação.',
    },
    {
      name: 'Comédia',
      description: 'Stand-up, apresentações humorísticas e noites de comédia.',
    },
  ]

  const categories: Category[] = []

  for (const category of data) {
    const created = await prisma.category.upsert({
      where: {
        name: category.name,
      },
      create: {
        name: category.name,
        description: category.description,
        createdBy: admin.id,
      },
      update: {},
    })

    categories.push(created)
  }

  console.log('Finished createCategories....')

  return categories
}

async function createProductionData({
  admin,
  categories,
}: {
  admin: User
  categories: Category[]
}): Promise<void> {
  console.log('Running createProductionData....')

  for (const item of productionData) {
    const address = await prisma.address.upsert({
      where: { id: randomUUID() },
      create: {
        street: item.address.street,
        neighborhood: item.address.neighborhood,
        number: item.address.number,
        cep: item.address.cep,
        city: item.address.city,
        state: item.address.state,
        latitude: item.address.latitude,
        longitude: item.address.longitude,
        createdBy: admin.id,
      },
      update: {},
    })

    // --- Create Company ---
    const company = await prisma.company.upsert({
      where: { slug: item.company.slug },
      create: {
        addressId: address.id,
        name: item.company.name,
        slug: item.company.slug,
        socialName: item.company.socialName,
        status: item.company.status,
        document: item.company.document,
        createdBy: admin.id,
      },
      update: {},
    })

    // --- Create Subscription ---
    const subEndDate = new Date()
    subEndDate.setDate(subEndDate.getDate() + item.subscription.daysDuration)

    await prisma.subscription.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        startDate: new Date(),
        endDate: subEndDate,
        amount: item.subscription.amount,
        status: item.subscription.status,
        createdBy: admin.id,
        updatedBy: admin.id,
      },
      update: {},
    })

    // --- Create Company Images ---
    for (const imgData of item.images) {
      const createdImage = await prisma.image.upsert({
        where: { id: randomUUID() },
        create: {
          url: imgData.url,
          alt: imgData.alt,
        },
        update: {},
      })

      await prisma.companyImage.upsert({
        where: {
          companyId_imageId: {
            companyId: company.id,
            imageId: createdImage.id,
          },
        },
        create: {
          companyId: company.id,
          imageId: createdImage.id,
        },
        update: {},
      })
    }

    for (const contact of item.contacts) {
      await prisma.information.upsert({
        where: {
          id: randomUUID(),
        },
        create: {
          companyId: company.id,
          name: contact.name,
          description: contact.description ?? null,
          email: contact.email ?? null,
          phoneNumber: contact.phoneNumber ?? null,
          createdBy: admin.id,
        },
        update: {},
      })
    }

    if (item.advertisement) {
      const advertisement = await prisma.advertisement.upsert({
        where: { id: randomUUID() },
        create: {
          companyId: company.id,
          eventId: null,
          description: item.advertisement.description,
          days: item.advertisement.days,
          amount: item.advertisement.amount,
          clicks: 0,
          insights: 0,
          status: AdvertisementStatus.ACTIVE,
          expirationDate: item.advertisement.expirationDate,
          createdBy: admin.id,
        },
        update: {},
      })

      await prisma.advertisementAuthorization.upsert({
        where: { id: randomUUID() },
        create: {
          advertisementId: advertisement.id,
          status: AdvertisementAuthorizationStatus.AUTHORIZED,
          decidedBy: admin.id,
          decidedAt: new Date(),
        },
        update: {},
      })

      await prisma.payment.upsert({
        where: { id: randomUUID() },
        create: {
          advertisementId: advertisement.id,
          amount: item.advertisement.amount,
          gateway: PaymentProvider.STRIPE,
          checkoutId: item.advertisement.paymentCheckoutId,
          tax: 0,
          link: item.advertisement.paymentLink,
          status: PaymentStatus.PAID,
          expiresAt: new Date('2024-11-25T23:59:59'),
          confirmationDate: new Date(),
        },
        update: {},
      })
    }

    // --- Process Events ---
    for (const eventData of item.events) {
      // Find Category
      const category = categories.find((c) => c.name === eventData.categoryName)
      if (!category) {
        console.error(
          `Category "${eventData.categoryName}" not found for event "${eventData.name}". Skipping.`,
        )
        continue
      }

      // Create Event Image
      const eventImageOne = await prisma.image.upsert({
        where: { id: randomUUID() },
        create: {
          url: eventData.image.url,
          alt: eventData.image.alt,
        },
        update: {},
      })

      let eventAddressId = address.id

      if (eventData.specificAddress) {
        const specificAddr = await prisma.address.upsert({
          where: { id: randomUUID() },
          create: {
            street: eventData.specificAddress.street,
            neighborhood: eventData.specificAddress.neighborhood,
            number: eventData.specificAddress.number,
            cep: eventData.specificAddress.cep,
            city: eventData.specificAddress.city,
            state: eventData.specificAddress.state,
            latitude: eventData.specificAddress.latitude,
            longitude: eventData.specificAddress.longitude,
            createdBy: admin.id,
          },
          update: {},
        })

        eventAddressId = specificAddr.id
      }

      // Create Event
      const event = await prisma.event.upsert({
        where: {
          companyId_slug: {
            companyId: company.id,
            slug: eventData.slug,
          },
        },
        create: {
          companyId: company.id,
          name: eventData.name,
          slug: eventData.slug,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          addressId: eventAddressId,
          categoryId: category.id,
          createdBy: admin.id,
        },
        update: {},
      })

      // Link Image to Event
      await prisma.eventImage.upsert({
        where: {
          eventId_imageId: {
            eventId: event.id,
            imageId: eventImageOne.id,
          },
        },
        create: {
          eventId: event.id,
          imageId: eventImageOne.id,
        },
        update: {},
      })

      // Create Information (Contact)
      for (const contact of eventData.contacts) {
        await prisma.information.upsert({
          where: { id: randomUUID() },
          create: {
            companyId: company.id,
            eventId: event.id,
            name: 'Contato',
            description: null,
            email: contact.email ?? null,
            phoneNumber: contact.phoneNumber ?? null,
            createdBy: admin.id,
          },
          update: {},
        })
      }

      // Create Coupons
      for (const coupon of eventData.coupons) {
        await prisma.coupon.upsert({
          where: {
            name_eventId: {
              eventId: event.id,
              name: coupon.name,
            },
          },
          create: {
            eventId: event.id,
            name: coupon.name,
            description: coupon.description,
            expiresAt: event.endDate,
            createdBy: admin.id,
          },
          update: {},
        })
      }

      // Create Advertisement Flow
      const advertisement = await prisma.advertisement.upsert({
        where: { id: randomUUID() },
        create: {
          companyId: company.id,
          eventId: event.id,
          description: eventData.advertisement.description,
          days: eventData.advertisement.days,
          amount: eventData.advertisement.amount,
          clicks: 0,
          insights: 0,
          status: AdvertisementStatus.ACTIVE,
          expirationDate: eventData.advertisement.expirationDate,
          createdBy: admin.id,
        },
        update: {},
      })

      await prisma.advertisementAuthorization.upsert({
        where: { id: randomUUID() },
        create: {
          advertisementId: advertisement.id,
          status: AdvertisementAuthorizationStatus.AUTHORIZED,
          decidedBy: admin.id,
          decidedAt: new Date(),
        },
        update: {},
      })

      const payment = await prisma.payment.upsert({
        where: { id: randomUUID() },
        create: {
          advertisementId: advertisement.id,
          amount: eventData.advertisement.amount,
          gateway: PaymentProvider.STRIPE,
          checkoutId: eventData.advertisement.paymentCheckoutId,
          tax: 0,
          link: eventData.advertisement.paymentLink,
          status: PaymentStatus.PAID,
          expiresAt: new Date('2025-11-25T18:00:00'),
          confirmationDate: new Date(),
        },
        update: {},
      })

      await prisma.notification.upsert({
        where: { id: randomUUID() },
        create: {
          recipientId: admin.id,
          title: 'Publicidade Autorizada',
          content: `Sua publicidade "${advertisement.description}" foi autorizada pelo moderador. Segue link para o pagamento: ${payment.link}`,
        },
        update: {},
      })
    }
  }

  console.log('Finished createProductionData....')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
