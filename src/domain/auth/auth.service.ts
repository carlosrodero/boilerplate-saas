import { auth } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autenticado");
    this.name = "UnauthorizedError";
  }
}

/**
 * Retorna a sessão atual ou lança UnauthorizedError.
 * O chamador (layout/ página) deve redirecionar para /login ao capturar.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  return session;
}

/**
 * Retorna os provedores OAuth conectados ao usuário (para exibir no perfil).
 * Stub: em desenvolvimento retorna lista vazia ou mock.
 */
export async function getConnectedAccounts(_userId: string): Promise<string[]> {
  // TODO: implementar com prisma.account.findMany({ where: { userId } }) e mapear provider
  if (process.env.NODE_ENV === "development") {
    return ["google"];
  }
  return [];
}
