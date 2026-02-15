"use client"

import type { BrandKit } from "@/lib/brands/brand-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TONE_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
]

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
        <div className="space-y-2">
          <Label htmlFor="kitName" className="text-xs text-muted-foreground">
            Kit Name
          </Label>
          <Input
            id="kitName"
            value={brandKit.kitName}
            onChange={(e) => onFieldChange("kitName", e.target.value)}
            placeholder="New Brand Kit #1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="text-xs text-muted-foreground">
            Website
          </Label>
          <Input
            id="website"
            value={brandKit.website}
            onChange={(e) => onFieldChange("website", e.target.value)}
            placeholder="yoursite.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandSummary" className="text-xs text-muted-foreground">
          Brand Summary
        </Label>
        <Textarea
          id="brandSummary"
          value={brandKit.brandSummary}
          onChange={(e) => onFieldChange("brandSummary", e.target.value)}
          placeholder="Write a short description of your brand"
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-xs text-muted-foreground">
          Address
        </Label>
        <Input
          id="address"
          value={brandKit.address}
          onChange={(e) => onFieldChange("address", e.target.value)}
          placeholder="123 Main Street, City, Country"
        />
      </div>

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
            {TONE_OPTIONS.map((option) => (
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
