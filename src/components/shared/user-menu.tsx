"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface UserMenuProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  isCollapsed?: boolean;
}

export function UserMenu({ user, isCollapsed = false }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center gap-2 px-2"
          aria-label="Menu do usuário"
        >
          <UserAvatar
            name={user.name}
            image={user.image}
            size="md"
            className="shrink-0"
          />
          {!isCollapsed ? (
            <div className="flex min-w-0 flex-1 flex-col items-start text-left">
              <span className="truncate text-sm font-medium">
                {user.name ?? "Usuário"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name ?? "Usuário"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Perfil</Link>
        </DropdownMenuItem>
        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <span>Tema</span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
