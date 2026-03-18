import { redirect } from "next/navigation";
import { requireAuth } from "@/domain/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await requireAuth();

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      inviteStatus: "ACCEPTED",
    },
    include: { organization: true },
  });

  if (membership) {
    redirect(`/${membership.organization.slug}/dashboard`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <OnboardingForm />
    </main>
  );
}
