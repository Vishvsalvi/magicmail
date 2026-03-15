"use client"

import type { BrandKit } from "@/lib/brands/brand-types"
import { TONE_OF_VOICE_OPTIONS } from "@/lib/constants/tone-of-voice"
import { FormField } from "@/components/ui/form-field"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type BrandDetailsSectionProps = {
  brandKit: BrandKit
  onFieldChange: <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => void
}

export function BrandDetailsSection({
  brandKit,
  onFieldChange,
}: BrandDetailsSectionProps) {
  return (
    <section id="brand-details" className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Brand Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="kitName"
          label="Kit Name"
          value={brandKit.kitName}
          onChange={(v) => onFieldChange("kitName", v)}
          placeholder="New Brand Kit #1"
        />
        <FormField
          id="website"
          label="Website"
          value={brandKit.website}
          onChange={(v) => onFieldChange("website", v)}
          placeholder="yoursite.com"
        />
      </div>

      <FormField
        id="brandSummary"
        label="Brand Summary"
        value={brandKit.brandSummary}
        onChange={(v) => onFieldChange("brandSummary", v)}
        placeholder="Write a short description of your brand"
        multiline
        className="min-h-[80px] resize-none"
      />

      <FormField
        id="address"
        label="Address"
        value={brandKit.address}
        onChange={(v) => onFieldChange("address", v)}
        placeholder="123 Main Street, City, Country"
      />

      <div className="space-y-2">
        <Label htmlFor="toneOfVoice" className="text-xs text-muted-foreground">
          Tone of Voice
        </Label>
        <Select
          value={brandKit.toneOfVoice}
          onValueChange={(value) => onFieldChange("toneOfVoice", value)}
        >
          <SelectTrigger id="toneOfVoice">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {TONE_OF_VOICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
