// data/production-seeds.ts
import { Decimal } from '@prisma/client/runtime/library'

import { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'
import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'

import type { SeedCompanyItem } from './seed-types'

export const productionData: SeedCompanyItem[] = [
  {
    company: {
      name: 'Universidade Positivo',
      slug: 'universidade-positivo',
      socialName: 'Centro de Estudos Superiores Positivo.',
      document: '78.791.712/0001-63',
      status: CompanyStatus.ACTIVE,
    },
    address: {
      street: 'Rua Pedro Viriato Parigot de Souza',
      neighborhood: 'Cidade Industrial',
      number: '5300',
      cep: '81280-330',
      city: 'Curitiba',
      state: 'PR',
      latitude: new Decimal(-25.446355),
      longitude: new Decimal(-49.356391),
    },
    subscription: {
      amount: 1000,
      daysDuration: 7,
      status: SubscriptionStatus.TRIAL,
    },
    advertisement: {
      description: 'Publicidade para a Universidade Positivo',
      days: 30,
      expirationDate: new Date('2025-12-25'),
      amount: 30000,
      paymentCheckoutId:
        'cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIY31238192731Fq8',
      paymentLink:
        'https://checkout.stripe.com/c/pay/cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIY31238192731Fq8#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0Sk9vfHFCM1xvRlNDMEhfPEdwMjF2VVV0Zz1hYjNSQUJwQU',
    },
    contacts: [
      {
        name: 'Estacionamento',
        description: 'Estacionamento 24 horas no local.',
      },
      {
        name: 'Central de Atendimento',
        email: 'up@edu.com.br',
      },
    ],
    images: [
      {
        url: 'erika-fletcher-MZxqc6n9qCw-unsplash.jpg',
        alt: 'Universidade Positivo',
      },
    ],
    events: [
      {
        name: 'Formatura Universidade Positivo 2026',
        slug: 'formatura-universidade-positivo-2026',
        categoryName: 'Formaturas',
        description:
          'A Formatura Universidade Positivo 2026 celebra a conclusão de uma jornada acadêmica marcada por esforço, conquistas e crescimento. O evento reúne formandos, familiares e convidados em uma cerimônia emocionante, com discursos inspiradores, homenagens especiais e entrega oficial dos diplomas. Após a solenidade, a celebração continua com uma festa exclusiva, ambiente sofisticado, música ao vivo e experiências pensadas para tornar essa noite inesquecível. Um momento único para eternizar conquistas e celebrar o início de uma nova etapa.',
        startDate: new Date('2026-11-25T19:00:00'),
        endDate: new Date('2026-11-25T23:00:00'),
        image: {
          url: 'joshua-hoehne-iggWDxHTAUQ-unsplash.jpg',
          alt: 'Formatura Universidade Positivo 2026',
        },
        contacts: [
          {
            name: 'MILENIUM FORMATURAS',
            phoneNumber: '(41) 93026-6606',
          },
        ],
        coupons: [
          {
            name: 'EROS10',
            description:
              '10% de desconto para esse evento com o cupom do professor Eros.',
          },
          {
            name: 'MAURICIO15',
            description:
              '15% de desconto para esse evento com o cupom do professor Maurício.',
          },
        ],
        advertisement: {
          description:
            'Publicidade para o evento de Formatura Universidade Positivo 2026',
          days: 2,
          expirationDate: new Date('2026-11-26T00:00:00'),
          amount: 7000,
          paymentCheckoutId:
            'cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIYyargR0pOm93KJgnyFq8',
          paymentLink:
            'https://checkout.stripe.com/c/pay/cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIYyargR0pOm93KJgnyFq8#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0Sk9vfHFCM1xvRlNDMEhfPEdwMjF2VVV0Zz1hYjNSQUJwQUY8MDNzUnRcPFJEaXBKQEdgYlBdTVJ0aFYyZGJvPWlcVEtLS1N3UXZRcH13VE10M2lmbDFDNTVOQ2JXdXNkTScpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl',
        },
      },
    ],
  },
  {
    company: {
      name: 'Gigg’s Bar',
      slug: 'giggs-bar',
      socialName: 'Google LLC',
      document: '00.000.000/0001-91',
      status: CompanyStatus.ACTIVE,
    },
    address: {
      street: 'Rua Mateus Leme',
      neighborhood: 'Centro Cívico',
      number: '885',
      cep: '80510-192',
      city: 'Curitiba',
      state: 'PR',
      latitude: new Decimal(-25.4195666),
      longitude: new Decimal(-49.2712358),
    },
    subscription: {
      amount: 1000,
      daysDuration: 7,
      status: SubscriptionStatus.TRIAL,
    },
    contacts: [
      {
        name: 'Gigg’s Bar Atendimento',
        phoneNumber: '(41) 99999-9999',
      },
    ],
    images: [
      {
        url: 'patrick-tomasso-GXXYkSwndP4-unsplash.jpg',
        alt: 'Gigg’s Bar',
      },
    ],
    events: [
      {
        name: 'Happy Hour no Gigg’s Bar',
        slug: 'happy-hour-no-giggs-bar',
        categoryName: 'Bares',
        description:
          'Venha aproveitar o melhor happy hour da cidade com promoções especiais em bebidas e petiscos.',
        startDate: new Date('2025-11-25T17:00:00'),
        endDate: new Date('2025-12-30T20:00:00'),
        image: {
          url: 'patrick-tomasso-GXXYkSwndP4-unsplash.jpg',
          alt: 'Happy Hour no Gigg’s Bar',
        },
        contacts: [
          {
            name: 'Gigg’s Bar Atendimento',
            phoneNumber: '(41) 99999-9999',
          },
        ],
        coupons: [
          {
            name: 'HAPPY20',
            description:
              '20% de desconto em todas as bebidas durante o happy hour.',
          },
        ],
        advertisement: {
          description: 'Publicidade para o evento Happy Hour no Gigg’s Bar',
          days: 35,
          expirationDate: new Date('2025-12-30T00:00:00'),
          amount: 35000,
          paymentCheckoutId:
            'cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIYzxcvbnMASDFq8',
          paymentLink:
            'https://checkout.stripe.com/c/pay/cs_test_a1Qo0sPE2cgE6FsbpqfqjzltR3YwpObb9ORJEIYzxcvbnMASDFq8#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0Sk9vfHFCM1xvRlNDMEhfPEdwMjF2VVV0Zz1hYjNSQUJwQUY8MDNzUnRcPFJEaXBKQEdgYlBdTVJ0aFYyZGJvPWlcVEtLS1N3UXZRcH13VE10M2lmbDFDNTVOQ2JXdXNkTScpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl',
        },
      },
    ],
  },
]
