import type { LucideIcon } from "lucide-react";
import { BadgeCheck, House } from "lucide-react";

export type AppNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const appNavItems: AppNavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: House,
  },
  {
    title: "Brands",
    href: "/brands",
    icon: BadgeCheck,
  },
];
