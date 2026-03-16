import type { Organization } from "./organization.types";

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
