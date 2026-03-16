"use server";

import { z } from "zod";
import { requireAuth } from "@/domain/auth";
import {
  createOrganization,
  isSlugAvailable,
} from "@/domain/organizations/organization.service";

const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Nome muito curto")
    .max(50, "Nome muito longo"),
  slug: z
    .string()
    .min(2, "URL muito curta")
    .max(30, "URL muito longa")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
});

export type CheckSlugResult =
  | { available: true }
  | { available: false; error: string };

/**
 * Verifica se o slug está disponível. Usado no onboarding com debounce.
 */
export async function checkSlugAvailabilityAction(
  slug: string
): Promise<CheckSlugResult> {
  const parsed = z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9-]+$/)
    .safeParse(slug);
  if (!parsed.success) {
    return { available: false, error: "URL inválida" };
  }
  const available = await isSlugAvailable(parsed.data);
  return available
    ? { available: true }
    : { available: false, error: "Esta URL já está em uso" };
}

/**
 * Cria a organização. Retorna orgSlug para o cliente redirecionar.
 */
export async function createOrganizationAction(formData: FormData) {
  const session = await requireAuth();

  const parsed = CreateOrganizationSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const org = await createOrganization({
    ...parsed.data,
    userId: session.user.id,
  });

  return { success: true as const, orgSlug: org.slug };
}
