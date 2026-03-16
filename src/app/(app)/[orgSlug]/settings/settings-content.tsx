"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Role } from "@/types/mock-domain";

interface SettingsContentProps {
  orgName: string;
  orgSlug: string;
  orgId: string;
  currentUserRole: Role;
}

export function SettingsContent({
  orgName,
  orgSlug,
  orgId,
  currentUserRole,
}: SettingsContentProps) {
  const [name, setName] = useState(orgName);
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = currentUserRole === "OWNER";
  const canEditName = isOwner || currentUserRole === "ADMIN";

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canEditName) return;
    startTransition(async () => {
      try {
        // TODO: Server Action updateOrganizationAction({ organizationId: orgId, name })
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Alterações salvas com sucesso");
      } catch {
        toast.error("Não foi possível salvar. Tente novamente.");
      }
    });
  }

  async function handleDeleteConfirm() {
    setDeleteLoading(true);
    try {
      // TODO: Server Action deleteOrganizationAction(orgId) → redirect /onboarding
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Organização removida");
      setDeleteOpen(false);
    } catch {
      toast.error("Não foi possível deletar a organização. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da organização"
      />

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold">
              Informações da organização
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="org-name">Nome da organização</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canEditName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-slug">URL da organização</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="org-slug"
                    value={orgSlug}
                    disabled
                    className="bg-muted"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  O slug não pode ser alterado após a criação
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!canEditName || isPending}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Separator className="my-6" />

      <Card className="border-destructive/30">
        <CardHeader>
          <h2 className="text-base font-semibold text-destructive">
            Zona de perigo
          </h2>
          <p className="text-sm text-muted-foreground">
            Estas ações são irreversíveis. Tenha certeza antes de continuar.
          </p>
        </CardHeader>
        <CardContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  disabled={!isOwner}
                >
                  Deletar organização
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {isOwner
                ? "Deletar esta organização e todos os dados"
                : "Apenas o proprietário pode deletar a organização"}
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deletar organização"
        description="Tem certeza? Esta ação não pode ser desfeita. Todos os dados serão permanentemente removidos."
        confirmLabel="Sim, deletar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </TooltipProvider>
  );
}
