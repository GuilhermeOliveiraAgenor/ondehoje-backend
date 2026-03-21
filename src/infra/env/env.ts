import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'deploy', 'production', 'test']),
  DATABASE_URL: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_REDIRECT_URI: z.url(),
  GOOGLE_OAUTH_RESPONSE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3333),
  MAILER_EMAIL_ADDRESS: z.email(),
  MAILER_API_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  AWS_BUCKET_URL: z.url(),
  AWS_BUCKET_PUBLIC_URL: z.url(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  STRIPE_API_KEY: z.string(),
  PAYMENT_GATEWAY_SUCCESS_URL: z.url(),
  PAYMENT_GATEWAY_CANCEL_URL: z.url(),
})

export type Env = z.infer<typeof envSchema>
