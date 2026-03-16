"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BillingActionsProps {
  isFree: boolean;
  orgSlug: string;
  subscriptionStatus: string;
  isProCard?: boolean;
}

export function BillingActions({
  isFree,
  orgSlug,
  subscriptionStatus,
  isProCard,
}: BillingActionsProps) {
  async function handleUpgrade() {
    try {
      // TODO: Server Action createCheckoutSession(orgId) → redirect Stripe Checkout
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Redirecionando para o checkout...");
    } catch {
      toast.error("Não foi possível iniciar o upgrade. Tente novamente.");
    }
  }

  async function handleManageSubscription() {
    try {
      // TODO: Server Action createPortalSession(orgId) → redirect Stripe Portal
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Redirecionando para o portal...");
    } catch {
      toast.error("Não foi possível abrir o portal. Tente novamente.");
    }
  }

  if (isProCard) {
    return (
      <Button className="w-full" onClick={handleUpgrade}>
        Fazer upgrade
      </Button>
    );
  }

  if (isFree) {
    return (
      <Button onClick={handleUpgrade}>Fazer upgrade</Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleManageSubscription}>
      Gerenciar assinatura
    </Button>
  );
}
