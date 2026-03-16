"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <AlertTriangle
        className="h-12 w-12 text-destructive"
        aria-hidden
      />
      <h1 className="mt-6 text-2xl font-semibold">Algo deu errado</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Ocorreu um erro inesperado. Nossa equipe foi notificada.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button variant="ghost" asChild>
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
}
