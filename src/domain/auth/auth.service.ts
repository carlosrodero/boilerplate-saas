import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autenticado");
    this.name = "UnauthorizedError";
  }
}

/**
 * Retorna a sessão ou redireciona para /login se não autenticado.
 * Usar em: Server Components, Server Actions e API Routes que requerem auth.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Retorna a sessão ou null. Não redireciona.
 * Usar em: layouts que precisam checar a sessão sem forçar redirect.
 */
export async function getSession() {
  return auth();
}

/**
 * Retorna os provedores OAuth conectados ao usuário (para exibir no perfil).
 */
export async function getConnectedAccounts(userId: string): Promise<string[]> {
  const { prisma } = await import("@/lib/prisma");
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true },
  });
  return accounts.map((a) => a.provider);
}
