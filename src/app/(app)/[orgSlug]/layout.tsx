import { redirect } from "next/navigation";
import { requireAuth } from "@/domain/auth";
import {
  getOrganizationBySlug,
  getUserOrganizations,
  requireRole,
} from "@/domain/organizations";
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

  let session;
  try {
    session = await requireAuth();
  } catch {
    redirect("/login");
  }

  const org = await getOrganizationBySlug(orgSlug);
  if (!org) {
    redirect("/onboarding");
  }

  try {
    await requireRole(session.user.id, org.id, "MEMBER");
  } catch {
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
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
