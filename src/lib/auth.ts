/**
 * Configuração e helpers do Auth.js (next-auth v5).
 * Stub: retorna null até a configuração real ser adicionada.
 */

export async function auth(): Promise<{
  user: { id: string; name: string | null; email: string; image: string | null };
} | null> {
  // TODO: implementar com getServerSession(authConfig) do next-auth
  if (process.env.NODE_ENV === "development") {
    return {
      user: {
        id: "demo-user-id",
        name: "Usuário Demo",
        email: "demo@example.com",
        image: null,
      },
    };
  }
  return null;
}
