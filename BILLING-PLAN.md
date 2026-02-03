# Plan Facturation Itqan

## Phase 1 — Schema & Backend
- [ ] Modèles Prisma : `Invoice`, `InvoiceItem` + enums + relations
- [ ] Migration DB
- [ ] API routes CRUD : `/api/invoices` (list, create, update, delete)
- [ ] API route : `/api/invoices/[id]/pdf` (génération PDF)
- [ ] API route : `/api/invoices/[id]/send` (envoi email avec PDF)
- [ ] Numérotation auto : `ITQ-YYYY-NNNN`
- [ ] Server actions pour les mutations

## Phase 2 — Génération PDF
- [ ] Install `@react-pdf/renderer`
- [ ] Template PDF facture marocaine conforme :
  - Logo Itqan
  - Infos émetteur (Itqan / Nextis AI)
  - Infos client (depuis ClientProfile : nom/société, ICE, RC, adresse)
  - Tableau lignes (description, qté, PU, montant)
  - Sous-total HT, TVA 20%, Total TTC
  - Mentions légales obligatoires
  - Conditions de paiement
- [ ] Endpoint GET qui retourne le PDF stream

## Phase 3 — Email
- [ ] Template email `invoiceEmail()` dans `src/lib/email.ts`
- [ ] Envoi via Resend avec PDF en pièce jointe (base64)
- [ ] Mise à jour `sentAt` après envoi

## Phase 4 — UI Admin
- [ ] `/admin/invoices` — Liste toutes les factures (filtres : status, client, date)
- [ ] `/admin/invoices/new` — Création facture (sélection client, ajout lignes, TVA)
- [ ] `/admin/invoices/[id]` — Détail + actions (envoyer, marquer payé, télécharger PDF, annuler)
- [ ] Dashboard stats (total facturé, impayé, payé ce mois)

## Phase 5 — UI Client
- [ ] `/invoices` — Mes factures (côté client donneur d'ordre)
- [ ] `/invoices/[id]` — Détail + téléchargement PDF
- [ ] Notification in-app quand nouvelle facture

## Stack
- Prisma (existant)
- `@react-pdf/renderer` pour PDF
- Resend (existant) pour email
- shadcn/ui (existant) pour UI
- Server actions Next.js

## Modèle de données

```prisma
enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

model Invoice {
  id              String        @id @default(cuid())
  invoiceNumber   String        @unique  // ITQ-2025-0001
  
  clientId        String
  client          User          @relation("ClientInvoices", fields: [clientId], references: [id])
  
  contractId      String?
  missionId       String?
  
  status          InvoiceStatus @default(DRAFT)
  
  issueDate       DateTime      @default(now())
  dueDate         DateTime
  paidAt          DateTime?
  sentAt          DateTime?
  
  subtotal        Float         // Total HT
  taxRate         Float         @default(20)  // TVA Maroc 20%
  taxAmount       Float         // Montant TVA
  totalAmount     Float         // Total TTC
  
  currency        String        @default("MAD")
  
  pdfUrl          String?
  notes           String?       @db.Text  // Conditions, mentions
  
  // Infos émetteur (snapshot au moment de la facture)
  issuerName      String        @default("Itqan")
  issuerAddress   String?
  issuerIce       String?
  issuerRc        String?
  issuerIf        String?
  
  // Infos client (snapshot)
  clientName      String
  clientEmail     String
  clientCompany   String?
  clientIce       String?
  clientRc        String?
  clientAddress   String?
  clientCity      String?
  
  items           InvoiceItem[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model InvoiceItem {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  description String
  quantity    Float    @default(1)
  unitPrice   Float
  amount      Float    // quantity * unitPrice
  
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
}
```

## Numérotation
- Format : `ITQ-{YYYY}-{NNNN}` (ex: ITQ-2025-0001)
- Séquentiel par année, jamais de trou
- Query : `SELECT MAX(invoiceNumber) WHERE invoiceNumber LIKE 'ITQ-2025-%'`
