import type { ReactNode } from "react";

/**
 * Layout do grupo (app): rotas protegidas.
 * A verificação de sessão é feita no layout de [orgSlug] ou em páginas como onboarding.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
