import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Gestion des utilisateurs" }
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, ChevronLeft, ChevronRight, Shield, CheckCircle, XCircle } from "lucide-react"
import { AdminUserActions } from "./user-actions"
import { AdminBadgeManager } from "@/components/admin-badge-manager"
import { CreateUserDialog } from "./create-user-dialog"
import { SearchInput } from "./search-input"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 50

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10))

  const where: any = {}
  if (sp.role && ["CLIENT", "FREELANCER", "ADMIN"].includes(sp.role)) {
    where.role = sp.role
  }
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { email: { contains: sp.q, mode: "insensitive" } },
    ]
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        freelancerProfile: { select: { verified: true } },
        clientProfile: { select: { verified: true } },
        badges: { select: { id: true, type: true, name: true, icon: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  function pageUrl(page: number) {
    const params = new URLSearchParams()
    if (sp.role) params.set("role", sp.role)
    if (sp.q) params.set("q", sp.q)
    if (page > 1) params.set("page", page.toString())
    const qs = params.toString()
    return `/admin/users${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Utilisateurs</h2>
          <p className="text-muted-foreground mt-1">Gérer les comptes de la plateforme</p>
        </div>
        <CreateUserDialog />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["ALL", "CLIENT", "FREELANCER", "ADMIN"].map((r) => {
            const isActive = (r === "ALL" && !sp.role) || sp.role === r
            const colorMap: Record<string, string> = {
              ALL: "bg-lime-400/10 text-lime-400",
              CLIENT: "bg-blue-400/10 text-blue-400",
              FREELANCER: "bg-lime-400/10 text-lime-400",
              ADMIN: "bg-red-400/10 text-red-400",
            }
            return (
              <a
                key={r}
                href={r === "ALL" ? "/admin/users" : `/admin/users?role=${r}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? colorMap[r]
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {r === "ALL" ? "Tous" : r}
              </a>
            )
          })}
        </div>
        <SearchInput />
      </div>

      <Card className="bg-card/80 border-border/80 overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-lime-400" />
            {totalCount} utilisateur(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Utilisateur</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Rôle</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Vérifié</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Inscrit</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const verified = u.freelancerProfile?.verified || u.clientProfile?.verified || false
                return (
                  <TableRow key={u.id} className="border-border/60 hover:bg-secondary/20 transition-colors group relative">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          u.role === "FREELANCER" ? "bg-lime-400/10 text-lime-400" :
                          u.role === "CLIENT" ? "bg-blue-400/10 text-blue-400" :
                          "bg-red-400/10 text-red-400"
                        }`}>
                          {(u.name || u.email)?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <Link href={`/admin/users/${u.id}`} className="text-foreground font-medium group-hover:text-lime-400 transition-colors text-sm after:absolute after:inset-0 after:content-['']">
                            {u.name || "—"}
                          </Link>
                          <p className="text-muted-foreground text-xs">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-0 text-xs ${
                        u.role === "FREELANCER" ? "bg-lime-400/10 text-lime-400" :
                        u.role === "CLIENT" ? "bg-blue-400/10 text-blue-400" :
                        "bg-red-400/10 text-red-400"
                      }`}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {verified ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-0 text-xs ${u.suspended ? "bg-red-400/10 text-red-400" : "bg-green-400/10 text-green-400"}`}>
                        {u.suspended ? "Suspendu" : "Actif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <div className="relative z-10 flex items-center gap-1">
                        <AdminUserActions
                          userId={u.id}
                          name={u.name}
                          email={u.email}
                          phone={u.phone}
                          role={u.role}
                          verified={verified}
                          suspended={u.suspended}
                        />
                        <AdminBadgeManager userId={u.id} currentBadges={u.badges} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {users.length === 0 && <p className="text-muted-foreground text-center py-10">Aucun utilisateur trouvé</p>}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link href={pageUrl(currentPage - 1)}>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-lg">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="ghost" disabled className="text-muted-foreground rounded-lg">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                )}
                {currentPage < totalPages ? (
                  <Link href={pageUrl(currentPage + 1)}>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-lg">
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="ghost" disabled className="text-muted-foreground rounded-lg">
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
