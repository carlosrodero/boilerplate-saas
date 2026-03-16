"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: string;
}

interface SidebarNavProps {
  items: NavItem[];
  orgSlug: string;
  currentPath: string;
  isCollapsed: boolean;
}

export function SidebarNav({
  items,
  orgSlug,
  currentPath,
  isCollapsed,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <TooltipProvider delayDuration={0}>
        {items.map((item) => {
          const href = `/${orgSlug}${item.href}`;
          const isActive =
            currentPath === href ||
            (item.href !== "/dashboard" && currentPath.startsWith(href));

          const linkContent = (
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </TooltipProvider>
    </nav>
  );
}
