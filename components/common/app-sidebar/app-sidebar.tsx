"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Sparkles,
  UserCircle2,
} from "lucide-react";

import { sidebarChats, requestNewChatReset } from "@/lib/chat-store";
import { appNavItems } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const brandKitGroupLabelClasses =
  "mb-1 block h-auto px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70";

const brandKitMenuButtonClasses =
  "h-auto gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/50 hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:shadow-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-60 data-[active=true]:[&>svg]:opacity-80";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-border/50 [&>[data-sidebar=sidebar]]:bg-card/80"
    >
      <SidebarHeader className="px-3 pt-4 pb-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-1 px-2 py-1.5 group-data-[collapsible=icon]:px-0">
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="truncate text-sm font-semibold tracking-wide group-data-[collapsible=icon]:hidden">
              MagicMail
            </span>
          </Link>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
        <div className="hidden px-2 pb-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger />
        </div>
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Chat"
              className={brandKitMenuButtonClasses}
              onClick={() => {
                requestNewChatReset();
                setOpenMobile(false);
                router.push("/");
              }}
            >
              <Plus />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-5 px-3 pb-6 group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={brandKitGroupLabelClasses}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {appNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className={brandKitMenuButtonClasses}
                  >
                    <Link href={item.href} onClick={handleNavClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={brandKitGroupLabelClasses}>
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sidebarChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    tooltip={chat.title}
                    className={brandKitMenuButtonClasses}
                  >
                    <MessageSquare />
                    <span>{chat.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Profile"
              className={brandKitMenuButtonClasses}
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold">
                VS
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">Vishv Salvi</span>
                <span className="truncate text-xs text-muted-foreground">
                  vishv@example.com
                </span>
              </div>
              <UserCircle2 className="group-data-[collapsible=icon]:hidden" />
              <MoreHorizontal className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
