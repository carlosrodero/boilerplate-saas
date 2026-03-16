import { getOrganizationBySlug, requireRole } from "@/domain/organizations";
import { requireAuth } from "@/domain/auth";
import { SettingsContent } from "./settings-content";
import type { Role } from "@/types/mock-domain";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await requireAuth();
  const org = await getOrganizationBySlug(orgSlug);
  if (!org) return null;

  const { role: currentUserRole } = await requireRole(
    session.user.id,
    org.id,
    "MEMBER"
  );

  return (
    <SettingsContent
      orgName={org.name}
      orgSlug={org.slug}
      orgId={org.id}
      currentUserRole={currentUserRole as Role}
    />
  );
}
