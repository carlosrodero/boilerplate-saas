import Link from "next/link";
import { Calendar, CreditCard, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { getOrganizationBySlug } from "@/domain/organizations";
import { getPlanName } from "@/config/plans";
import { formatDate } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared";
import type { SubStatus } from "@/types/mock-domain";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: React.ReactNode;
  description?: string;
}

function MetricCard({ title, value, icon: Icon, badge, description }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-row items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Icon className="h-8 w-8 text-muted-foreground" aria-hidden />
          {badge ?? null}
        </div>
      </div>
    </Card>
  );
}

/** Mock: em produção viria de memberships + subscription. */
function getDashboardMock(orgId: string) {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  return {
    membersCount: 2,
    planName: getPlanName(null),
    status: "INACTIVE" as SubStatus,
    currentPeriodEnd: null as Date | null,
    orgCreatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const org = await getOrganizationBySlug(orgSlug);
  if (!org) return null;

  const mock = getDashboardMock(org.id);
  const renewalLabel =
    mock.currentPeriodEnd != null
      ? formatDate(mock.currentPeriodEnd)
      : "—";
  const showWelcome =
    mock.orgCreatedAt.getTime() >
    Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-1">
        <MetricCard
          title="Membros"
          value={mock.membersCount}
          icon={Users}
        />
        <MetricCard
          title="Plano"
          value={mock.planName}
          icon={CreditCard}
          badge={
            <StatusBadge
              variant={mock.status === "ACTIVE" ? "active" : "inactive"}
              label={mock.status === "ACTIVE" ? "Ativo" : "Inativo"}
            />
          }
        />
        <MetricCard
          title="Renovação"
          value={renewalLabel}
          icon={Calendar}
        />
      </div>

      {showWelcome ? (
        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Primeiros passos</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary" aria-hidden>✓</span>
              Organização criada
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground" aria-hidden>○</span>
              <Link
                href={`/${orgSlug}/members`}
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                Convidar primeiro membro
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground" aria-hidden>○</span>
              <Link
                href={`/${orgSlug}/billing`}
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                Configurar plano
              </Link>
            </li>
          </ul>
        </Card>
      ) : null}
    </>
  );
}
