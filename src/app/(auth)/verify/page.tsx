import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VerifyPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { email } = await searchParams;
  const displayEmail = email ?? "seu e-mail";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <MailCheck className="h-12 w-12 text-primary" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Verifique seu e-mail
          </CardTitle>
          <CardDescription>
            Enviamos um link de acesso para{" "}
            <strong className="text-foreground">{displayEmail}</strong>. Clique
            no link para entrar na sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Não recebeu? Verifique a pasta de spam.
          </p>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">← Voltar para o login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
