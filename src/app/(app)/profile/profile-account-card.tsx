"use client";

import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileAccountCardProps {
  email: string;
  emailVerified: boolean;
  providers: string[];
}

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  resend: "E-mail",
};

export function ProfileAccountCard({
  email,
  emailVerified,
  providers,
}: ProfileAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>E-mail e provedores conectados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">E-mail</span>
          <span className="font-medium">{email}</span>
          <Badge variant={emailVerified ? "default" : "secondary"}>
            {emailVerified ? "Verificado" : "Pendente"}
          </Badge>
        </div>
        {providers.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Provedores conectados
            </span>
            {providers.map((provider) => (
              <Badge key={provider} variant="outline">
                {PROVIDER_LABELS[provider] ?? provider}
              </Badge>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sair de todas as sessões
        </Button>
      </CardContent>
    </Card>
  );
}
