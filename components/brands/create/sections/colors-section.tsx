"use client"

import { useState } from "react"
import type { BrandColors } from "@/lib/brands/brand-types"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ColorsSectionProps = {
  colors: BrandColors
  onColorChange: (key: keyof BrandColors, value: string) => void
}

const COLOR_FIELDS: {
  key: keyof BrandColors
  label: string
  description: string
}[] = [
  {
    key: "background",
    label: "Background",
    description: "The main background of your email",
  },
  {
    key: "container",
    label: "Container",
    description: "The content box of the email",
  },
  {
    key: "foreground",
    label: "Foreground",
    description: "Text and other content elements",
  },
  {
    key: "accent",
    label: "Accent",
    description: "Buttons, links, and highlights",
  },
  {
    key: "buttonText",
    label: "Button Text",
    description: "Text on buttons",
  },
]

const HEX_COLOR_PATTERN = /^#?[0-9a-fA-F]{6}$/

function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  if (!HEX_COLOR_PATTERN.test(trimmed)) return null
  return `#${trimmed.replace("#", "").toLowerCase()}`
}

function ColorPickerBox({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftColor, setDraftColor] = useState(value)
  const [hexInput, setHexInput] = useState(value.toUpperCase())

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (nextOpen) {
      setDraftColor(value)
      setHexInput(value.toUpperCase())
    }
  }

  const handleColorInputChange = (nextColor: string) => {
    setDraftColor(nextColor)
    setHexInput(nextColor.toUpperCase())
  }

  const handleHexInputChange = (nextInput: string) => {
    setHexInput(nextInput)
    const normalized = normalizeHex(nextInput)
    if (normalized) {
      setDraftColor(normalized)
    }
  }

  const handleCancel = () => {
    setDraftColor(value)
    setHexInput(value.toUpperCase())
    setIsOpen(false)
  }

  const handleSave = () => {
    onChange(draftColor)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <div className="space-y-2">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/60 shadow-sm transition-all hover:border-muted-foreground/40 hover:shadow-md"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Open {label} color picker</span>
          </button>
        </PopoverTrigger>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <PopoverContent className="w-80 space-y-3 p-3" side="bottom" align="start">
        <PopoverHeader>
          <PopoverTitle>{label} color</PopoverTitle>
          <PopoverDescription className="text-xs">
            {description}
          </PopoverDescription>
        </PopoverHeader>

        <div className="space-y-3">
          <div
            className="h-14 w-full rounded-lg border border-border/70"
            style={{ backgroundColor: draftColor }}
          />

          <Input
            type="color"
            value={draftColor}
            onChange={(event) => handleColorInputChange(event.target.value)}
            className="h-14 cursor-pointer rounded-lg border border-border/70 p-1"
            aria-label={`${label} color picker`}
          />

          <Input
            value={hexInput}
            onChange={(event) => handleHexInputChange(event.target.value)}
            className="font-mono uppercase"
            aria-label={`${label} hex value`}
            placeholder="#000000"
            maxLength={7}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ColorsSection({
  colors,
  onColorChange,
}: ColorsSectionProps) {
  return (
    <section id="colors" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Colors</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the look and feel of your email with your brand colors.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {COLOR_FIELDS.map((field) => (
          <ColorPickerBox
            key={field.key}
            label={field.label}
            description={field.description}
            value={colors[field.key]}
            onChange={(v) => onColorChange(field.key, v)}
          />
        ))}
      </div>
    </section>
  )
}
