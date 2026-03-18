import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { requireAuth } from "@/domain/auth";
import { getUserOrganizations } from "@/domain/organizations";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/shared/sidebar";

interface OrgSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgSlugLayout({
  children,
  params,
}: OrgSlugLayoutProps) {
  const { orgSlug } = await params;
  const session = await requireAuth();

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) {
    notFound();
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: org.id,
      },
    },
  });
  if (!membership) {
    redirect("/onboarding");
  }

  const organizations = await getUserOrganizations(session.user.id);

  return (
    <div className="flex h-screen">
      <Sidebar
        orgSlug={orgSlug}
        currentOrg={org}
        organizations={organizations}
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? "",
          image: session.user.image ?? null,
        }}
      />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
