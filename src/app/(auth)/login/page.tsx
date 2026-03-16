import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
