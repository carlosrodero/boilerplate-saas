"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";

interface Org {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface OrgSwitcherProps {
  currentOrg: Org;
  organizations: Org[];
  isCollapsed?: boolean;
}

export function OrgSwitcher({
  currentOrg,
  organizations,
  isCollapsed = false,
}: OrgSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center gap-2 px-2"
          aria-label="Trocar organização"
        >
          <UserAvatar
            name={currentOrg.name}
            image={currentOrg.image}
            size="sm"
            className="shrink-0"
          />
          {!isCollapsed ? (
            <>
              <span className="truncate text-left font-medium">
                {currentOrg.name}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/${org.slug}/dashboard`} className="flex items-center gap-2">
              <UserAvatar name={org.name} image={org.image} size="sm" />
              <span className="truncate">{org.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <Link href="/onboarding" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed text-xs font-medium text-muted-foreground">
              +
            </span>
            Nova organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
