"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/common/app-sidebar/app-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
  defaultSidebarOpen?: boolean;
  headerTitle?: ReactNode;
  headerActions?: ReactNode;
  layoutVariant?: "default" | "brand-create";
};

export function AppShell({
  children,
  defaultSidebarOpen = true,
  headerTitle,
  headerActions,
  layoutVariant = "default",
}: AppShellProps) {
  const isBrandCreateLayout = layoutVariant === "brand-create";

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <header
          className={
            isBrandCreateLayout
              ? "relative z-20 flex h-14 shrink-0 items-center border-b border-border/50 bg-background px-4"
              : "flex h-8 shrink-0 items-center gap-2 px-3"
          }
        >
          {isBrandCreateLayout ? <div className="min-w-0 pr-4">{headerTitle}</div> : null}
          <div className={isBrandCreateLayout ? "ml-auto flex items-center gap-2" : "ml-auto mt-2 flex items-center gap-2"}>
            {headerActions}
            <ThemeToggle />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
