"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/common/app-sidebar/app-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
  defaultSidebarOpen?: boolean;
};

export function AppShell({ children, defaultSidebarOpen = true }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-8 items-center gap-2 px-3">
          <div className="ml-auto mt-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex min-h-[calc(100svh-3rem)] flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
