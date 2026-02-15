"use client"

import { cn } from "@/lib/utils"
import {
  LayoutGrid,
  Scale,
  Hash,
  Image,
  Palette,
} from "lucide-react"

export type SectionId =
  | "brand-details"
  | "legal"
  | "socials"
  | "logos"
  | "colors"

type SectionItem = {
  id: SectionId
  label: string
  icon: React.ReactNode
}

type SectionGroup = {
  label: string
  items: SectionItem[]
}

const SECTION_GROUPS: (SectionItem | SectionGroup)[] = [
  {
    id: "brand-details",
    label: "Brand Details",
    icon: <LayoutGrid className="size-4" />,
  },
  {
    label: "Content",
    items: [
      {
        id: "legal",
        label: "Legal",
        icon: <Scale className="size-4" />,
      },
      {
        id: "socials",
        label: "Socials",
        icon: <Hash className="size-4" />,
      },
    ],
  },
  {
    label: "Visuals",
    items: [
      {
        id: "logos",
        label: "Logos",
        icon: <Image className="size-4" />,
      },
      {
        id: "colors",
        label: "Color",
        icon: <Palette className="size-4" />,
      },
    ],
  },
]

function isGroup(item: SectionItem | SectionGroup): item is SectionGroup {
  return "items" in item
}

type SectionSidebarProps = {
  activeSection: SectionId
  onSectionClick: (id: SectionId) => void
}

export function SectionSidebar({
  activeSection,
  onSectionClick,
}: SectionSidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r border-border/50 bg-card/80">
      <nav className="flex flex-1 flex-col gap-5 px-3 pb-6 pt-5">
        {SECTION_GROUPS.map((entry) => {
          if (isGroup(entry)) {
            return (
              <div key={entry.label}>
                <span className="mb-1 block px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {entry.label}
                </span>
                <div className="flex flex-col gap-0.5">
                  {entry.items.map((item) => (
                    <SidebarButton
                      key={item.id}
                      item={item}
                      isActive={activeSection === item.id}
                      onClick={() => onSectionClick(item.id)}
                    />
                  ))}
                </div>
              </div>
            )
          }

          return (
            <SidebarButton
              key={entry.id}
              item={entry}
              isActive={activeSection === entry.id}
              onClick={() => onSectionClick(entry.id)}
            />
          )
        })}
      </nav>
    </aside>
  )
}

function SidebarButton({
  item,
  isActive,
  onClick,
}: {
  item: SectionItem
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
        isActive
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <span className={cn("shrink-0", isActive ? "opacity-80" : "opacity-60")}>
        {item.icon}
      </span>
      {item.label}
    </button>
  )
}
