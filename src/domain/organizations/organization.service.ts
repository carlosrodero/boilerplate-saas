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
 * Stub: em desenvolvimento retorna org com os dados informados.
 */
export async function createOrganization(data: {
  name: string;
  slug: string;
  userId: string;
}): Promise<Organization> {
  // TODO: implementar com prisma.$transaction (org + membership + subscription)
  if (process.env.NODE_ENV === "development") {
    return {
      id: `stub-${data.slug}-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      image: null,
    };
  }
  throw new Error("createOrganization não implementado sem Prisma");
}

/**
 * Busca organização pelo slug.
 * Stub: retorna null até Prisma estar configurado.
 * Em desenvolvimento com slug "demo", retorna org fake para testar o layout.
 */
export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  // TODO: implementar com prisma.organization.findUnique({ where: { slug } })
  if (process.env.NODE_ENV === "development" && slug === "demo") {
    return {
      id: "demo-org-id",
      name: "Organização Demo",
      slug: "demo",
      image: null,
    };
  }
  return null;
}

/**
 * Lista organizações do usuário.
 * Stub: em desenvolvimento com userId qualquer, retorna lista com org demo.
 */
export async function getUserOrganizations(
  _userId: string
): Promise<Organization[]> {
  // TODO: implementar com prisma
  if (process.env.NODE_ENV === "development") {
    return [
      {
        id: "demo-org-id",
        name: "Organização Demo",
        slug: "demo",
        image: null,
      },
    ];
  }
  return [];
}
