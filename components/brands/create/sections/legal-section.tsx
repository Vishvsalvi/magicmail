"use client"

import type { BrandKit } from "@/lib/brands/brand-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LegalSectionProps = {
  brandKit: BrandKit
  onFieldChange: <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => void
}

export function LegalSection({ brandKit, onFieldChange }: LegalSectionProps) {
  return (
    <section id="legal" className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Legal</h2>

      <div className="space-y-2">
        <Label htmlFor="copyright" className="text-xs text-muted-foreground">
          Copyright
        </Label>
        <Input
          id="copyright"
          value={brandKit.copyright}
          onChange={(e) => onFieldChange("copyright", e.target.value)}
          placeholder={`© ${new Date().getFullYear()}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer" className="text-xs text-muted-foreground">
          Footer
        </Label>
        <Input
          id="footer"
          value={brandKit.footer}
          onChange={(e) => onFieldChange("footer", e.target.value)}
          placeholder="Add standard footer text that appears in every email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disclaimers" className="text-xs text-muted-foreground">
          Disclaimers
        </Label>
        <Input
          id="disclaimers"
          value={brandKit.disclaimers}
          onChange={(e) => onFieldChange("disclaimers", e.target.value)}
          placeholder="Add any disclaimers or legal information needed"
        />
      </div>
    </section>
  )
}
