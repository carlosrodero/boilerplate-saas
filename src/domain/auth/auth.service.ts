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
