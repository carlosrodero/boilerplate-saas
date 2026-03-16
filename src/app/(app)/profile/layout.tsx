import { redirect } from "next/navigation";
import { requireAuth } from "@/domain/auth";
import { getUserOrganizations } from "@/domain/organizations";
import { Sidebar } from "@/components/shared/sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    redirect("/login");
  }

  const organizations = await getUserOrganizations(session.user.id);
  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
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
