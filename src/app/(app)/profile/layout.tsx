import { requireAuth } from "@/domain/auth";
import { getUserOrganizations } from "@/domain/organizations";
import { Sidebar } from "@/components/shared/sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const organizations = await getUserOrganizations(session.user.id);
  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? "",
    image: session.user.image ?? null,
  };

  if (organizations.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  const currentOrg = organizations[0];
  if (!currentOrg) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        orgSlug={currentOrg.slug}
        currentOrg={currentOrg}
        organizations={organizations}
        user={user}
      />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
