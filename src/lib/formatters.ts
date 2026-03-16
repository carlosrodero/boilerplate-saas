/**
 * Formatadores para exibição na UI — locale pt-BR.
 * Use apenas para apresentação; não para persistência ou cálculos.
 */

const ptBR = "pt-BR";

export function formatDate(date: Date | string | number): string {
  const d = typeof date === "object" && "getTime" in date ? date : new Date(date);
  return new Intl.DateTimeFormat(ptBR, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(ptBR, {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const ROLE_LABELS: Record<string, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  TRIALING: "Trial",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelado",
  UNPAID: "Inadimplente",
};
