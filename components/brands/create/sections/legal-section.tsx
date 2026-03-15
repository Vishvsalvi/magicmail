"use client"

import type { BrandKit } from "@/lib/brands/brand-types"
import { FormField } from "@/components/ui/form-field"

type LegalSectionProps = {
  brandKit: BrandKit
  onFieldChange: <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => void
}

export function LegalSection({ brandKit, onFieldChange }: LegalSectionProps) {
  return (
    <section id="legal" className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Legal</h2>

      <FormField
        id="copyright"
        label="Copyright"
        value={brandKit.copyright}
        onChange={(v) => onFieldChange("copyright", v)}
        placeholder={`© ${new Date().getFullYear()}`}
      />

      <FormField
        id="footer"
        label="Footer"
        value={brandKit.footer}
        onChange={(v) => onFieldChange("footer", v)}
        placeholder="Add standard footer text that appears in every email"
      />

      <FormField
        id="disclaimers"
        label="Disclaimers"
        value={brandKit.disclaimers}
        onChange={(v) => onFieldChange("disclaimers", v)}
        placeholder="Add any disclaimers or legal information needed"
      />
    </section>
  )
}
