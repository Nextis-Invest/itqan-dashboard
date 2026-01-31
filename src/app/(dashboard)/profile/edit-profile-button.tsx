"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export function EditProfileButton({ role }: { role: string }) {
  return (
    <Link href="/profile/edit">
      <Button
        variant="outline"
        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
      >
        <Pencil className="mr-2 h-4 w-4" />
        Modifier
      </Button>
    </Link>
  )
}
