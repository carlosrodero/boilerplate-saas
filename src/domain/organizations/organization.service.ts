import { prisma } from "@/lib/prisma";
import type { Organization } from "./organization.types";

/**
 * Gera um slug URL-safe a partir do nome.
 * Ex: "Minha Empresa" → "minha-empresa"
 */
export function generateSlug(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "org"
  );
}

/**
 * Verifica se o slug está disponível (não existe organização com esse slug).
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 2) return false;
  const existing = await getOrganizationBySlug(slug);
  return existing === null;
}

/**
 * Cria uma nova organização e associa o usuário como OWNER.
 * Cria org + membership + subscription (stripeCustomerId placeholder até integrar Stripe).
 */
export async function createOrganization(data: {
  name: string;
  slug: string;
  userId: string;
}): Promise<Organization> {
  return prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: data.name, slug: data.slug },
    });
    await tx.membership.create({
      data: {
        userId: data.userId,
        organizationId: org.id,
        role: "OWNER",
        inviteStatus: "ACCEPTED",
      },
    });
    await tx.subscription.create({
      data: {
        organizationId: org.id,
        stripeCustomerId: `cus_pending_${org.id}`,
        status: "INACTIVE",
      },
    });
    return { id: org.id, name: org.name, slug: org.slug, image: org.image };
  });
}

/**
 * Busca organização pelo slug.
 */
export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const org = await prisma.organization.findUnique({
    where: { slug },
  });
  return org;
}

/**
 * Lista organizações do usuário (com membership aceita).
 */
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const memberships = await prisma.membership.findMany({
    where: { userId, inviteStatus: "ACCEPTED" },
    include: { organization: true },
  });
  return memberships.map((m) => m.organization);
}

export type ProfileMembership = {
  organization: Organization;
  role: string;
};

/**
 * Lista membrosias do usuário com organização e role (para página de perfil).
 */
export async function getProfileMemberships(
  userId: string
): Promise<ProfileMembership[]> {
  const memberships = await prisma.membership.findMany({
    where: { userId, inviteStatus: "ACCEPTED" },
    include: { organization: true },
  });
  return memberships.map((m) => ({
    organization: m.organization,
    role: m.role,
  }));
}
