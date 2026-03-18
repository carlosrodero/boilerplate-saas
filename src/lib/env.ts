/**
 * Validação de variáveis de ambiente no startup.
 * Se qualquer variável crítica estiver ausente, a aplicação lança erro e não inicia.
 */
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().startsWith("re_"),
  EMAIL_FROM: z.string().email(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
  // Vazio ou ausente = Sentry desabilitado; se preenchido, deve ser URL válida
  SENTRY_DSN: z.union([z.string().url(), z.literal("")]).optional(),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
});

export const env = EnvSchema.parse(process.env);
