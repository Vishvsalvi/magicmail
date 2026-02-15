"use client"

import type { SocialLink } from "@/lib/brands/brand-types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

type SocialsSectionProps = {
  socials: SocialLink[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, field: keyof SocialLink, value: string) => void
}

export function SocialsSection({
  socials,
  onAdd,
  onRemove,
  onUpdate,
}: SocialsSectionProps) {
  return (
    <section id="socials" className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Socials</h2>

      {socials.length > 0 && (
        <div className="space-y-3">
          {socials.map((social, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <Input
                  value={social.platform}
                  onChange={(e) => onUpdate(index, "platform", e.target.value)}
                  placeholder="Platform (e.g. Twitter)"
                />
                <Input
                  value={social.url}
                  onChange={(e) => onUpdate(index, "url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="size-4" />
        Add
      </Button>
    </section>
  )
}
