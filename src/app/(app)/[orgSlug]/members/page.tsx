import { getOrganizationBySlug, requireRole } from "@/domain/organizations";
import { requireAuth } from "@/domain/auth";
import { MembersContent } from "./members-content";
import type { Membership, Role, User } from "@/types/mock-domain";

/** Mock: em produção viria de prisma.membership.findMany({ where: { organizationId }, include: { user: true } }). */
function getMockMemberships(orgId: string): Membership[] {
  const now = new Date();
  return [
    {
      id: "mem-1",
      userId: "user-1",
      organizationId: orgId,
      role: "OWNER" as Role,
      createdAt: now,
      user: {
        id: "user-1",
        email: "owner@exemplo.com",
        name: "Proprietário",
        image: null,
        emailVerified: now,
        createdAt: now,
      } as User,
    },
    {
      id: "mem-2",
      userId: "user-2",
      organizationId: orgId,
      role: "MEMBER" as Role,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      user: {
        id: "user-2",
        email: "membro@exemplo.com",
        name: "Membro",
        image: null,
        emailVerified: null,
        createdAt: now,
      } as User,
    },
  ];
}

export default async function MembersPage({
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
  const memberships = getMockMemberships(org.id);
  const canInvite =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  return (
    <MembersContent
      memberships={memberships}
      currentUserId={session.user.id}
      currentUserRole={currentUserRole as Role}
      orgSlug={orgSlug}
      canInvite={canInvite}
    />
  );
}
