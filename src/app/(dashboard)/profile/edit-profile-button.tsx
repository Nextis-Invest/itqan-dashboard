"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export function EditProfileButton({ role }: { role: string }) {
  return (
    <Link href="/profile/edit">
      <Button
        variant="outline"
        size="sm"
        className="border-border/50 bg-card/60 backdrop-blur-sm text-foreground/80 hover:bg-accent hover:text-foreground hover:border-border transition-all duration-200"
      >
        <Pencil className="mr-2 h-3.5 w-3.5" />
        Modifier
      </Button>
    </Link>
  )
}
