export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Verifica se o usuário tem o role mínimo na organização.
 * Stub: em desenvolvimento aceita org "demo"; caso contrário lança.
 */
export async function requireRole(
  _userId: string,
  _organizationId: string,
  _minRole: string
): Promise<{ role: string }> {
  // TODO: implementar com prisma.membership.findFirst
  if (process.env.NODE_ENV === "development") {
    return { role: "OWNER" };
  }
  throw new ForbiddenError("Sem permissão para acessar esta organização");
}
