"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type SaveBrandButtonProps = {
  onSave: () => void
  isSaved: boolean
}

export function SaveBrandButton({ onSave, isSaved }: SaveBrandButtonProps) {
  return (
    <Button
      size="sm"
      onClick={onSave}
      variant={isSaved ? "secondary" : "default"}
      className="min-w-[72px]"
    >
      {isSaved ? (
        <>
          <Check className="size-3.5" />
          Saved
        </>
      ) : (
        "Save"
      )}
    </Button>
  )
}
