"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, CreditCard, LayoutDashboard, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarNav, type NavItem } from "@/components/shared/sidebar-nav";
import { OrgSwitcher } from "@/components/shared/org-switcher";
import { UserMenu } from "@/components/shared/user-menu";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 64;
const STORAGE_KEY = "sidebar:collapsed";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Membros", href: "/members", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Configurações", href: "/settings", icon: Settings },
];

interface SidebarProps {
  orgSlug: string;
  currentOrg: { id: string; name: string; slug: string; image: string | null };
  organizations: Array<{ id: string; name: string; slug: string; image: string | null }>;
  user: { name: string | null; email: string; image: string | null };
}

export function Sidebar({
  orgSlug,
  currentOrg,
  organizations,
  user,
}: SidebarProps) {
  const pathname = usePathname() ?? "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
  }, [mounted]);

  function toggleCollapsed() {
    const next = !isCollapsed;
    setIsCollapsed(next);
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, String(next));
    }
  }

  const width = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <aside
      className="flex h-screen flex-col border-r bg-card transition-all duration-200 ease-in-out"
      style={{ width }}
    >
      <div className="flex h-14 items-center gap-2 border-b px-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden />
          )}
        </Button>
        {!isCollapsed ? (
          <Link href={`/${orgSlug}/dashboard`} className="font-semibold">
            SaaS
          </Link>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className="px-2">
          <OrgSwitcher
            currentOrg={currentOrg}
            organizations={organizations}
            isCollapsed={isCollapsed}
          />
        </div>
        <Separator className="my-2" />
        <div className="px-2">
          <SidebarNav
            items={NAV_ITEMS}
            orgSlug={orgSlug}
            currentPath={pathname}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>

      <div className="mt-auto border-t p-2">
        <UserMenu user={user} isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
