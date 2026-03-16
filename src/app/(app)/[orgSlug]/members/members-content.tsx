"use client";

import { useState } from "react";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { EmptyState } from "@/components/shared";
import { UserAvatar } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS } from "@/lib/formatters";
import type { Membership, Role } from "@/types/mock-domain";
import { formatDate } from "@/lib/formatters";

const ROLE_ORDER: Record<Role, number> = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
};

function roleVariant(role: Role): "owner" | "admin" | "member" {
  return role.toLowerCase() as "owner" | "admin" | "member";
}

interface MembersContentProps {
  memberships: Membership[];
  currentUserId: string;
  currentUserRole: Role;
  orgSlug: string;
  canInvite: boolean;
}

export function MembersContent({
  memberships,
  currentUserId,
  currentUserRole,
  orgSlug,
  canInvite,
}: MembersContentProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [removeTarget, setRemoveTarget] = useState<Membership | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const sorted = [...memberships].sort(
    (a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
  );
  const onlyOwner = memberships.length === 1 && memberships[0]?.role === "OWNER";

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    try {
      // TODO: Server Action inviteMemberAction({ email: inviteEmail, role: inviteRole, organizationId })
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Convite enviado com sucesso");
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("MEMBER");
    } catch {
      toast.error("Não foi possível enviar o convite. Tente novamente.");
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRemoveConfirm() {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      // TODO: Server Action removeMemberAction(removeTarget.id)
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Membro removido da organização");
      setRemoveTarget(null);
    } catch {
      toast.error("Não foi possível remover o membro. Tente novamente.");
    } finally {
      setRemoveLoading(false);
    }
  }

  function canChangeRole(m: Membership): boolean {
    return m.userId !== currentUserId && m.role !== "OWNER";
  }
  function canRemove(m: Membership): boolean {
    return m.userId !== currentUserId && m.role !== "OWNER";
  }

  return (
    <>
      <PageHeader
        title="Membros"
        description="Gerencie quem tem acesso à organização"
        action={
          canInvite ? (
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" aria-hidden />
              Convidar membro
            </Button>
          ) : undefined
        }
      />

      {onlyOwner ? (
        <EmptyState
          icon={UserPlus}
          title="Nenhum membro ainda"
          description="Convide alguém para começar a colaborar."
          action={
            canInvite
              ? { label: "Convidar membro", onClick: () => setInviteOpen(true) }
              : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="w-[70px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((m) => {
                const user = m.user;
                if (!user) return null;
                const isSelf = m.userId === currentUserId;
                const showActions = canChangeRole(m) || canRemove(m);
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          image={user.image}
                          size="md"
                        />
                        <div>
                          <p className="font-medium">{user.name ?? "—"}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        variant={roleVariant(m.role)}
                        label={ROLE_LABELS[m.role] ?? m.role}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(m.createdAt)}
                    </TableCell>
                    <TableCell>
                      {showActions ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="Abrir ações"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Alterar função
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  disabled={m.role === "ADMIN"}
                                  onClick={() => {
                                    // TODO: changeRoleAction(m.id, 'ADMIN')
                                    toast.success("Função alterada para Administrador");
                                  }}
                                >
                                  {ROLE_LABELS.ADMIN}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={m.role === "MEMBER"}
                                  onClick={() => {
                                    // TODO: changeRoleAction(m.id, 'MEMBER')
                                    toast.success("Função alterada para Membro");
                                  }}
                                >
                                  {ROLE_LABELS.MEMBER}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              disabled={!canRemove(m)}
                              onClick={() => setRemoveTarget(m)}
                            >
                              Remover da organização
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">E-mail</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Função</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as "ADMIN" | "MEMBER")}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">{ROLE_LABELS.ADMIN}</SelectItem>
                    <SelectItem value="MEMBER">{ROLE_LABELS.MEMBER}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
                disabled={inviteLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={inviteLoading}>
                {inviteLoading ? "Enviando..." : "Enviar convite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={removeTarget != null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remover membro"
        description="Tem certeza que deseja remover este membro da organização? Ele perderá o acesso."
        confirmLabel="Sim, remover"
        variant="destructive"
        onConfirm={handleRemoveConfirm}
        loading={removeLoading}
      />
    </>
  );
}
