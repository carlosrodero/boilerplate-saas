/**
 * Planos e limites (DOMAIN.md). stripePriceId em produção via env.
 */

export const PLANS = {
  free: {
    name: "Free",
    stripePriceId: null as string | null,
    priceCents: 0,
    limits: {
      members: 3,
    },
    features: ["Até 3 membros", "Suporte por e-mail"],
  },
  pro: {
    name: "Pro",
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    priceCents: 9700, // R$ 97,00
    limits: {
      members: Infinity,
    },
    features: ["Membros ilimitados", "Suporte prioritário", "Relatórios avançados"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByPriceId(priceId: string | null): (typeof PLANS)[PlanKey] | null {
  if (!priceId) return PLANS.free;
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    if (PLANS[key].stripePriceId === priceId) return PLANS[key];
  }
  return null;
}

export function getPlanName(priceId: string | null): string {
  const plan = getPlanByPriceId(priceId);
  return plan?.name ?? "Free";
}
