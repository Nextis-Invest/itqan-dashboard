import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TicketReplyForm } from "./ticket-reply-form"
import { TicketStatusActions } from "./ticket-status-actions"

export const dynamic = "force-dynamic"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      replies: {
        include: { user: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) notFound()

  const statusColors: Record<string, string> = {
    OPEN: "bg-lime-400/10 text-lime-400",
    IN_PROGRESS: "bg-blue-400/10 text-blue-400",
    RESOLVED: "bg-green-400/10 text-green-400",
    CLOSED: "bg-neutral-500/10 text-neutral-400",
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/support">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{ticket.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-neutral-400 text-sm">{ticket.user.name || ticket.user.email}</span>
            <Badge className={`${statusColors[ticket.status]} border-0`}>{ticket.status}</Badge>
          </div>
        </div>
        <TicketStatusActions ticketId={ticket.id} currentStatus={ticket.status} />
      </div>

      {/* Original message */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-medium text-sm">{ticket.user.name || ticket.user.email}</span>
            <span className="text-neutral-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
          <p className="text-neutral-300 text-sm whitespace-pre-wrap">{ticket.message}</p>
        </CardContent>
      </Card>

      {/* Replies */}
      {ticket.replies.map((reply) => (
        <Card key={reply.id} className={`border-neutral-800 ${reply.user.role === "ADMIN" ? "bg-lime-400/5" : "bg-neutral-900"}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white font-medium text-sm">{reply.user.name || reply.user.email}</span>
              {reply.user.role === "ADMIN" && <Badge className="bg-lime-400/10 text-lime-400 border-0 text-xs">Admin</Badge>}
              <span className="text-neutral-500 text-xs">{new Date(reply.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            <p className="text-neutral-300 text-sm whitespace-pre-wrap">{reply.message}</p>
          </CardContent>
        </Card>
      ))}

      {/* Reply form */}
      {ticket.status !== "CLOSED" && <TicketReplyForm ticketId={ticket.id} />}
    </div>
  )
}
