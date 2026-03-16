import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrganizationBySlug, requireRole } from "@/domain/organizations";
import { requireAuth } from "@/domain/auth";
import { PLANS, getPlanName } from "@/config/plans";
import { formatDate, formatCurrency } from "@/lib/formatters";
import { STATUS_LABELS } from "@/lib/formatters";
import type { SubStatus } from "@/types/mock-domain";
import { BillingActions } from "./billing-actions";

/** Mock: em produção viria de subscription da org. */
function getMockSubscription(orgId: string) {
  return {
    id: "sub-1",
    organizationId: orgId,
    stripeCustomerId: "cus_mock",
    stripeSubscriptionId: null as string | null,
    stripePriceId: null as string | null,
    status: "INACTIVE" as SubStatus,
    currentPeriodEnd: null as Date | null,
    cancelAtPeriodEnd: false,
    updatedAt: new Date(),
  };
}

export default async function BillingPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await requireAuth();
  const org = await getOrganizationBySlug(orgSlug);
  if (!org) return null;

  try {
    await requireRole(session.user.id, org.id, "OWNER");
  } catch {
    redirect(`/${orgSlug}/dashboard`);
  }

  const subscription = getMockSubscription(org.id);
  const planName = getPlanName(subscription.stripePriceId);
  const isFree = subscription.status === "INACTIVE" || !subscription.stripePriceId;
  const statusVariant =
    subscription.status === "ACTIVE"
      ? "active"
      : subscription.status === "PAST_DUE"
        ? "past_due"
        : subscription.status === "TRIALING"
          ? "trialing"
          : subscription.status === "CANCELED" || subscription.status === "UNPAID"
            ? "canceled"
            : "inactive";

  return (
    <>
      <PageHeader
        title="Plano e Faturamento"
        description="Gerencie sua assinatura"
      />

      <Card className="mb-6">
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">
            Plano atual
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-semibold tracking-tight">{planName}</p>
          <StatusBadge
            variant={statusVariant}
            label={STATUS_LABELS[subscription.status] ?? subscription.status}
          />
          {subscription.status === "ACTIVE" && subscription.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Renova em {formatDate(subscription.currentPeriodEnd)}
            </p>
          )}
          {subscription.cancelAtPeriodEnd &&
            subscription.currentPeriodEnd && (
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                Cancela em {formatDate(subscription.currentPeriodEnd)}
              </p>
            )}
          {subscription.status === "PAST_DUE" && (
            <p className="text-sm text-destructive">
              Pagamento pendente — atualize seu cartão
            </p>
          )}
        </CardContent>
        <CardFooter>
          <BillingActions
            isFree={isFree}
            orgSlug={orgSlug}
            subscriptionStatus={subscription.status}
          />
        </CardFooter>
      </Card>

      {isFree ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">{PLANS.free.name}</CardTitle>
              <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Atual
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {formatCurrency(PLANS.free.priceCents)}
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </p>
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {PLANS.free.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">{PLANS.pro.name}</CardTitle>
              <span className="rounded-full border border-primary bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Recomendado
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {formatCurrency(PLANS.pro.priceCents)}
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </p>
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {PLANS.pro.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <BillingActions
                isFree={true}
                orgSlug={orgSlug}
                subscriptionStatus={subscription.status}
                isProCard
              />
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  );
}
