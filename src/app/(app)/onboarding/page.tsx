import { redirect } from "next/navigation";
import { requireAuth, UnauthorizedError } from "@/domain/auth";
import { getUserOrganizations } from "@/domain/organizations";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  let session;
  try {
    session = await requireAuth();
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    throw e;
  }
  const organizations = await getUserOrganizations(session.user.id);

  if (organizations.length > 0) {
    redirect(`/${organizations[0].slug}/dashboard`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <OnboardingForm />
    </main>
  );
}
