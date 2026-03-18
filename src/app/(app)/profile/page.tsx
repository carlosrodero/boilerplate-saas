import { getConnectedAccounts, requireAuth } from "@/domain/auth";
import { getProfileMemberships } from "@/domain/organizations";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileNameForm } from "./profile-name-form";
import { ProfileOrgsCard } from "./profile-orgs-card";
import { ProfileAccountCard } from "./profile-account-card";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireAuth();
  const [memberships, accounts] = await Promise.all([
    getProfileMemberships(session.user.id),
    getConnectedAccounts(session.user.id),
  ]);

  const emailVerified = session.user.emailVerified ?? false;

  return (
    <>
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={session.user.name ?? null}
                image={session.user.image ?? null}
                size="xl"
              />
              <div>
                <p className="font-medium">{session.user.name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {session.user.email ?? ""}
                </p>
              </div>
            </div>
            <Separator />
            <ProfileNameForm initialName={session.user.name ?? ""} />
          </CardContent>
        </Card>

        <ProfileOrgsCard memberships={memberships} />

        <ProfileAccountCard
          email={session.user.email ?? ""}
          emailVerified={Boolean(emailVerified)}
          providers={accounts}
        />
      </div>
    </>
  );
}
