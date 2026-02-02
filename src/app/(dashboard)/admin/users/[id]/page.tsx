import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Mail,
  Globe,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { AdminNotesForm } from "./admin-notes-form"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true },
  })
  return { title: user ? `${user.name || user.email} — Admin` : "Utilisateur" }
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (admin?.role !== "ADMIN") redirect("/dashboard")

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      clientProfile: true,
      freelancerProfile: true,
      clientMissions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          status: true,
          budget: true,
          budgetMin: true,
          budgetMax: true,
          currency: true,
          createdAt: true,
        },
      },
      reviewsReceived: {
        include: {
          author: { select: { name: true, email: true } },
          mission: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!user) notFound()

  // Get payments if client
  const payments = user.clientProfile
    ? await prisma.payment.findMany({
        where: {
          contract: {
            clientId: user.id,
          },
        },
        include: {
          contract: {
            select: {
              mission: { select: { id: true, title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : []

  const cp = user.clientProfile
  const fp = user.freelancerProfile

  const statusColors: Record<string, string> = {
    DRAFT: "bg-muted/50 text-muted-foreground",
    OPEN: "bg-lime-400/10 text-lime-400",
    IN_PROGRESS: "bg-blue-400/10 text-blue-400",
    COMPLETED: "bg-green-400/10 text-green-400",
    CANCELLED: "bg-red-400/10 text-red-400",
  }

  const paymentStatusColors: Record<string, string> = {
    PENDING: "bg-yellow-400/10 text-yellow-400",
    ESCROWED: "bg-blue-400/10 text-blue-400",
    RELEASED: "bg-green-400/10 text-green-400",
    REFUNDED: "bg-orange-400/10 text-orange-400",
    FAILED: "bg-red-400/10 text-red-400",
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {user.name || user.email}
            </h2>
            <Badge
              className={`border-0 text-xs ${
                user.role === "FREELANCER"
                  ? "bg-lime-400/10 text-lime-400"
                  : user.role === "CLIENT"
                  ? "bg-blue-400/10 text-blue-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {user.role}
            </Badge>
            {user.suspended && (
              <Badge className="bg-red-400/10 text-red-400 border-0 text-xs">
                Suspendu
              </Badge>
            )}
            {(cp?.verified || fp?.verified) && (
              <CheckCircle className="h-5 w-5 text-lime-400" />
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            <Mail className="h-3.5 w-3.5 inline mr-1" />
            {user.email}
            {user.phone && (
              <span className="ml-3">
                <Phone className="h-3.5 w-3.5 inline mr-1" />
                {user.phone}
              </span>
            )}
            <span className="ml-3">
              Inscrit le{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </p>
        </div>
      </div>

      {/* Client Profile — Full Detail */}
      {cp && (
        <>
          {/* Identity & Company */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-lime-400" />
                  Identité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow
                  label="Type"
                  value={
                    cp.personType === "PHYSICAL"
                      ? "Personne physique"
                      : cp.personType === "MORAL"
                      ? "Personne morale"
                      : "Non renseigné"
                  }
                />
                {cp.cin && <InfoRow label="CIN" value={cp.cin} mono />}
                {cp.dateOfBirth && (
                  <InfoRow
                    label="Date de naissance"
                    value={new Date(cp.dateOfBirth).toLocaleDateString(
                      "fr-FR"
                    )}
                  />
                )}
                <InfoRow
                  label="Vérifié"
                  value={cp.verified ? "✅ Oui" : "❌ Non"}
                />
                <InfoRow
                  label="Missions postées"
                  value={String(cp.totalMissions)}
                />
                <InfoRow
                  label="Total dépensé"
                  value={`${cp.totalSpent.toLocaleString("fr-FR")} MAD`}
                />
                {cp.avgRating !== null && cp.avgRating !== undefined && (
                  <InfoRow
                    label="Note moyenne"
                    value={`${cp.avgRating.toFixed(1)} ⭐`}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-lime-400" />
                  Société
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {cp.companyName && (
                  <InfoRow label="Entreprise" value={cp.companyName} />
                )}
                {cp.formeJuridique && (
                  <InfoRow label="Forme juridique" value={cp.formeJuridique} />
                )}
                {cp.companySize && (
                  <InfoRow
                    label="Taille"
                    value={`${cp.companySize} employés`}
                  />
                )}
                {cp.industry && (
                  <InfoRow label="Secteur" value={cp.industry} />
                )}
                {cp.capitalSocial !== null && cp.capitalSocial !== undefined && (
                  <InfoRow
                    label="Capital social"
                    value={`${cp.capitalSocial.toLocaleString("fr-FR")} MAD`}
                  />
                )}
                {cp.rc && <InfoRow label="RC" value={cp.rc} mono />}
                {cp.ice && <InfoRow label="ICE" value={cp.ice} mono />}
                {cp.patente && (
                  <InfoRow label="Patente" value={cp.patente} mono />
                )}
                {cp.cnss && <InfoRow label="CNSS" value={cp.cnss} mono />}
                {cp.website && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Site web</span>
                    <a
                      href={cp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-400 hover:underline flex items-center gap-1 text-xs"
                    >
                      <Globe className="h-3 w-3" />
                      {cp.website}
                    </a>
                  </div>
                )}
                {!cp.companyName &&
                  !cp.rc &&
                  !cp.ice &&
                  !cp.formeJuridique && (
                    <p className="text-muted-foreground italic">
                      Aucune info société renseignée
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Contact & Address & Payment */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Phone className="h-4 w-4 text-lime-400" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {cp.phone && <InfoRow label="Tél." value={cp.phone} />}
                {cp.phoneSecondary && (
                  <InfoRow label="Tél. 2" value={cp.phoneSecondary} />
                )}
                {cp.contactEmail && (
                  <InfoRow label="Email contact" value={cp.contactEmail} />
                )}
                {!cp.phone && !cp.phoneSecondary && !cp.contactEmail && (
                  <p className="text-muted-foreground italic">
                    Aucun contact renseigné
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-lime-400" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {cp.address && <InfoRow label="Adresse" value={cp.address} />}
                {cp.city && <InfoRow label="Ville" value={cp.city} />}
                {cp.postalCode && (
                  <InfoRow label="Code postal" value={cp.postalCode} />
                )}
                {cp.region && <InfoRow label="Région" value={cp.region} />}
                <InfoRow label="Pays" value={cp.country} />
                {!cp.address && !cp.city && (
                  <p className="text-muted-foreground italic">
                    Aucune adresse renseignée
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-lime-400" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {cp.preferredPaymentMethod && (
                  <InfoRow
                    label="Méthode"
                    value={cp.preferredPaymentMethod}
                  />
                )}
                {cp.bankName && (
                  <InfoRow label="Banque" value={cp.bankName} />
                )}
                {cp.bankIban && (
                  <InfoRow label="IBAN" value={cp.bankIban} mono />
                )}
                {cp.bankRib && (
                  <InfoRow label="RIB" value={cp.bankRib} mono />
                )}
                {!cp.preferredPaymentMethod &&
                  !cp.bankName &&
                  !cp.bankIban && (
                    <p className="text-muted-foreground italic">
                      Aucune info bancaire
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Notes */}
          <AdminNotesForm userId={user.id} currentNotes={cp.adminNotes} />
        </>
      )}

      {/* Freelancer Profile Summary */}
      {fp && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <User className="h-4 w-4 text-lime-400" />
              Profil Freelancer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {fp.title && <InfoRow label="Titre" value={fp.title} />}
            {fp.category && <InfoRow label="Catégorie" value={fp.category} />}
            {fp.city && <InfoRow label="Ville" value={fp.city} />}
            {fp.dailyRate && (
              <InfoRow
                label="Tarif journalier"
                value={`${fp.dailyRate} ${fp.currency}`}
              />
            )}
            <InfoRow
              label="Missions terminées"
              value={String(fp.completedMissions)}
            />
            {fp.avgRating !== null && fp.avgRating !== undefined && (
              <InfoRow
                label="Note moyenne"
                value={`${fp.avgRating.toFixed(1)} ⭐`}
              />
            )}
            <InfoRow
              label="Disponible"
              value={fp.available ? "Oui" : "Non"}
            />
            <InfoRow label="Remote" value={fp.remote ? "Oui" : "Non"} />
            {fp.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {fp.skills.map((s) => (
                  <Badge
                    key={s}
                    className="bg-lime-400/10 text-lime-400 border-0 text-xs"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Missions */}
      {user.clientMissions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-lime-400" />
              Missions créées ({user.clientMissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.clientMissions.map((m) => (
                <Link
                  key={m.id}
                  href={`/missions/${m.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="text-foreground text-sm font-medium">{m.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(m.budget || m.budgetMin) && (
                      <span className="text-muted-foreground text-xs">
                        {m.budget
                          ? `${m.budget} ${m.currency}`
                          : `${m.budgetMin}-${m.budgetMax} ${m.currency}`}
                      </span>
                    )}
                    <Badge
                      className={`border-0 text-xs ${
                        statusColors[m.status] || statusColors.DRAFT
                      }`}
                    >
                      {m.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      {payments.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-lime-400" />
              Historique des paiements ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-muted/50 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {p.amount.toLocaleString("fr-FR")} {p.currency}
                        {p.fee > 0 && (
                          <span className="text-muted-foreground text-xs ml-2">
                            (frais: {p.fee} {p.currency})
                          </span>
                        )}
                      </p>
                      {p.contract?.mission && (
                        <Link
                          href={`/missions/${p.contract.mission.id}`}
                          className="text-lime-400 text-xs hover:underline"
                        >
                          {p.contract.mission.title}
                        </Link>
                      )}
                    </div>
                    <Badge
                      className={`border-0 text-xs ${
                        paymentStatusColors[p.status] ||
                        paymentStatusColors.PENDING
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {p.transactionNumber && (
                      <span>Tx: {p.transactionNumber}</span>
                    )}
                    {p.paymentMethod && <span>Via: {p.paymentMethod}</span>}
                    {p.cardLast4 && <span>Carte: ****{p.cardLast4}</span>}
                    {p.bankReference && <span>Réf: {p.bankReference}</span>}
                    {p.paidByName && <span>Par: {p.paidByName}</span>}
                    {p.paidByEmail && <span>({p.paidByEmail})</span>}
                    <span>
                      {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {p.notes && (
                    <p className="text-muted-foreground text-xs italic">
                      {p.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {user.reviewsReceived.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-lime-400" />
              Avis reçus ({user.reviewsReceived.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.reviewsReceived.map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-medium">
                    {review.author.name || review.author.email}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  Mission: {review.mission.title}
                </p>
                {review.comment && (
                  <p className="text-foreground/80 text-sm mt-1">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`text-foreground text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}
