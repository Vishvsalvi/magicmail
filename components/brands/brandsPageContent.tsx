"use client"

import { useState } from "react"

import AddBrandDialog from "@/components/brands/addBrandDialog"
import EmptyState from "@/components/brands/emptyState"

export default function BrandsPageContent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <EmptyState onAddBrand={() => setOpen(true)} />
      <AddBrandDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
