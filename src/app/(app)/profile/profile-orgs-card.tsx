"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { ProfileMembership } from "@/domain/organizations";
import { ROLE_LABELS } from "@/lib/formatters";

interface ProfileOrgsCardProps {
  memberships: ProfileMembership[];
}

const ROLE_VARIANT: Record<string, "owner" | "admin" | "member"> = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
};

export function ProfileOrgsCard({ memberships }: ProfileOrgsCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas organizações</CardTitle>
        <CardDescription>
          Organizações das quais você faz parte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {memberships.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhuma organização"
            description="Crie ou entre em uma organização para começar."
            action={{
              label: "Criar organização",
              onClick: () => router.push("/onboarding"),
            }}
          />
        ) : (
          <ul className="space-y-3">
            {memberships.map(({ organization, role }) => (
              <li
                key={organization.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={organization.name}
                    image={organization.image}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{organization.name}</p>
                    <StatusBadge
                      variant={ROLE_VARIANT[role] ?? "member"}
                      label={ROLE_LABELS[role] ?? role}
                    />
                  </div>
                </div>
                <Link
                  href={`/${organization.slug}/dashboard`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Acessar →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
