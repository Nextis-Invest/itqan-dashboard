# SCHEMA-PLAN.md — Prisma SaaS Marketplace

## Architecture : Mise en relation Client ↔ Freelance

### Flux principal
```
Client crée Mission → Freelances envoient Propositions → Client accepte
→ Contrat créé → Milestones/Livrables → Paiement par étape → Review
```

---

## 📊 Schéma complet

### Existant (à enrichir) ✅
- User, Account, Session (auth)
- Mission, Proposal, Review

### À ajouter 🆕

---

### 1. PROFILS

#### FreelancerProfile (1:1 avec User)
```prisma
model FreelancerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String?          // "Développeur React Senior"
  bio         String?  @db.Text
  avatar      String?
  hourlyRate  Float?
  dailyRate   Float?
  currency    String   @default("MAD")
  
  // Localisation
  city        String?          // "Casablanca"
  country     String   @default("MA")
  remote      Boolean  @default(true)
  
  // Compétences
  skills      String[]         // ["React", "Next.js", "TypeScript"]
  category    String?          // slug from categories.ts
  subcategory String?
  experience  Int?             // années d'expérience
  
  // Vérification
  verified    Boolean  @default(false)
  verifiedAt  DateTime?
  badgeLevel  String?          // "BRONZE" | "SILVER" | "GOLD"
  
  // Stats calculées
  completedMissions Int @default(0)
  avgRating         Float?
  responseTime      Int?       // minutes moyennes
  
  // Portfolio
  portfolioUrl String?
  linkedinUrl  String?
  githubUrl    String?
  websiteUrl   String?
  
  // Disponibilité
  available       Boolean  @default(true)
  availableFrom   DateTime?
  weeklyHours     Int?     // heures dispo par semaine
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  portfolio   PortfolioItem[]
  education   Education[]
  certifications Certification[]
}
```

#### ClientProfile (1:1 avec User)
```prisma
model ClientProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName String?
  companySize String?          // "1-10" | "11-50" | "51-200" | "200+"
  industry    String?
  website     String?
  logo        String?
  
  // Localisation
  city        String?
  country     String   @default("MA")
  
  // Vérification
  verified    Boolean  @default(false)
  ice         String?          // Identifiant Commun de l'Entreprise
  
  // Stats
  totalMissions    Int @default(0)
  totalSpent       Float @default(0)
  avgRating        Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 2. MISSION (enrichir l'existant)

```prisma
model Mission {
  // ... existant ...
  
  // 🆕 Ajouts
  type          MissionType  @default(FIXED)  // FIXED | HOURLY | RETAINER
  budgetMin     Float?
  budgetMax     Float?
  duration      String?       // "1 semaine", "1 mois", "3 mois"
  experienceLevel String?     // "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT"
  remote        Boolean      @default(true)
  location      String?
  
  // Visibilité
  visibility    MissionVisibility @default(PUBLIC) // PUBLIC | INVITE_ONLY
  featured      Boolean      @default(false)
  
  // Compteurs
  viewCount     Int          @default(0)
  proposalCount Int          @default(0)
  
  // Relations 🆕
  contract      Contract?
  milestones    Milestone[]
  messages      Message[]
  attachments   Attachment[]
  invitations   Invitation[]
}

enum MissionType {
  FIXED      // Prix fixe
  HOURLY     // Taux horaire
  RETAINER   // Forfait mensuel
}

enum MissionVisibility {
  PUBLIC
  INVITE_ONLY
}
```

---

### 3. CONTRAT & PAIEMENT

```prisma
model Contract {
  id          String   @id @default(cuid())
  missionId   String   @unique
  mission     Mission  @relation(fields: [missionId], references: [id])
  
  proposalId  String   @unique
  proposal    Proposal @relation(fields: [proposalId], references: [id])
  
  clientId    String
  freelancerId String
  
  totalAmount Float
  currency    String   @default("MAD")
  
  status      ContractStatus @default(PENDING)
  
  startDate   DateTime?
  endDate     DateTime?
  signedByClient    Boolean @default(false)
  signedByFreelancer Boolean @default(false)
  
  // Termes
  terms       String?  @db.Text
  
  milestones  Milestone[]
  payments    Payment[]
  disputes    Dispute[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ContractStatus {
  PENDING        // En attente de signature
  ACTIVE         // En cours
  COMPLETED      // Terminé
  CANCELLED      // Annulé
  DISPUTED       // En litige
}

model Milestone {
  id          String   @id @default(cuid())
  contractId  String?
  contract    Contract? @relation(fields: [contractId], references: [id])
  missionId   String?
  mission     Mission?  @relation(fields: [missionId], references: [id])
  
  title       String
  description String?  @db.Text
  amount      Float
  dueDate     DateTime?
  
  status      MilestoneStatus @default(PENDING)
  
  // Livrable
  deliverables Attachment[]
  
  completedAt DateTime?
  approvedAt  DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum MilestoneStatus {
  PENDING       // À faire
  IN_PROGRESS   // En cours
  SUBMITTED     // Livré, en attente validation
  APPROVED      // Validé par le client
  REVISION      // Révision demandée
  PAID          // Payé
}

model Payment {
  id          String   @id @default(cuid())
  contractId  String
  contract    Contract @relation(fields: [contractId], references: [id])
  
  amount      Float
  currency    String   @default("MAD")
  fee         Float    @default(0)   // Commission Itqan
  netAmount   Float                   // Montant net freelance
  
  status      PaymentStatus @default(PENDING)
  method      String?                 // "BANK_TRANSFER" | "CARD" | "PAYPAL"
  
  // Escrow
  escrowedAt  DateTime?
  releasedAt  DateTime?
  
  // Références externes
  externalId  String?                 // ID transaction Stripe/CMI
  invoiceUrl  String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum PaymentStatus {
  PENDING       // En attente
  ESCROWED      // En séquestre (Itqan détient les fonds)
  RELEASED      // Libéré au freelance
  REFUNDED      // Remboursé au client
  FAILED        // Échec
}
```

---

### 4. MESSAGERIE

```prisma
model Conversation {
  id          String   @id @default(cuid())
  missionId   String?
  
  participants ConversationParticipant[]
  messages     Message[]
  
  lastMessageAt DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ConversationParticipant {
  id              String       @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId          String
  user            User         @relation(fields: [userId], references: [id])
  
  unreadCount     Int          @default(0)
  lastReadAt      DateTime?
  
  @@unique([conversationId, userId])
}

model Message {
  id              String       @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  senderId        String
  sender          User         @relation(fields: [senderId], references: [id])
  
  content         String       @db.Text
  type            MessageType  @default(TEXT)
  
  // Lien optionnel mission
  missionId       String?
  mission         Mission?     @relation(fields: [missionId], references: [id])
  
  attachments     Attachment[]
  
  readAt          DateTime?
  createdAt       DateTime     @default(now())
}

enum MessageType {
  TEXT
  SYSTEM          // "Mission acceptée", "Paiement reçu"
  PROPOSAL        // Proposition envoyée
  MILESTONE       // Mise à jour milestone
  FILE            // Fichier partagé
}
```

---

### 5. NOTIFICATIONS

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  body      String?
  
  // Lien contextuel
  entityType String?         // "MISSION" | "PROPOSAL" | "CONTRACT" | "MESSAGE"
  entityId   String?
  actionUrl  String?
  
  read      Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
}

enum NotificationType {
  NEW_PROPOSAL        // Freelance a envoyé une proposition
  PROPOSAL_ACCEPTED   // Client a accepté votre proposition
  PROPOSAL_REJECTED
  NEW_MESSAGE
  MILESTONE_SUBMITTED // Freelance a livré
  MILESTONE_APPROVED  // Client a validé
  PAYMENT_RECEIVED
  PAYMENT_RELEASED
  REVIEW_RECEIVED
  MISSION_INVITATION
  CONTRACT_SIGNED
  DISPUTE_OPENED
}
```

---

### 6. INVITATIONS & FAVORIS

```prisma
model Invitation {
  id          String   @id @default(cuid())
  missionId   String
  mission     Mission  @relation(fields: [missionId], references: [id])
  
  freelancerId String
  freelancer   User    @relation(fields: [freelancerId], references: [id])
  
  message     String?
  status      InvitationStatus @default(PENDING)
  
  createdAt   DateTime @default(now())
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
}

model Favorite {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Peut favoriser un freelance OU une mission
  freelancerId String?
  missionId    String?
  
  createdAt   DateTime @default(now())
  
  @@unique([userId, freelancerId])
  @@unique([userId, missionId])
}
```

---

### 7. FICHIERS & PORTFOLIO

```prisma
model Attachment {
  id          String   @id @default(cuid())
  name        String
  url         String
  size        Int?
  mimeType    String?
  
  // Relations polymorphiques
  missionId   String?
  milestoneId String?
  messageId   String?
  
  uploaderId  String
  
  createdAt   DateTime @default(now())
}

model PortfolioItem {
  id          String   @id @default(cuid())
  profileId   String
  profile     FreelancerProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  title       String
  description String?  @db.Text
  imageUrl    String?
  projectUrl  String?
  tags        String[]
  
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
}

model Education {
  id          String   @id @default(cuid())
  profileId   String
  profile     FreelancerProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  school      String
  degree      String?
  field       String?
  startYear   Int?
  endYear     Int?
}

model Certification {
  id          String   @id @default(cuid())
  profileId   String
  profile     FreelancerProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  name        String
  issuer      String?
  issueDate   DateTime?
  expiryDate  DateTime?
  url         String?
}
```

---

### 8. DISPUTE (litige)

```prisma
model Dispute {
  id          String   @id @default(cuid())
  contractId  String
  contract    Contract @relation(fields: [contractId], references: [id])
  
  openedById  String
  openedBy    User     @relation(fields: [openedById], references: [id])
  
  reason      String   @db.Text
  status      DisputeStatus @default(OPEN)
  
  resolution  String?  @db.Text
  resolvedAt  DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum DisputeStatus {
  OPEN
  UNDER_REVIEW
  RESOLVED
  CLOSED
}
```

---

## 🔄 Flux SaaS complet

```
1. CLIENT s'inscrit → crée ClientProfile
2. CLIENT publie Mission (DRAFT → OPEN)
3. FREELANCE voit la mission → envoie Proposal
4. CLIENT reçoit Notification → compare Proposals
5. CLIENT accepte une Proposal → Contract créé
6. Les deux signent → Contract ACTIVE
7. Milestones définis → Freelance travaille
8. Freelance soumet livrable → Milestone SUBMITTED
9. Client valide → Milestone APPROVED → Payment ESCROWED → RELEASED
10. Mission terminée → Review mutuel
```

---

## 💰 Modèle de revenus

| Source | % | Quand |
|--------|---|-------|
| Commission transaction | 10-15% | Sur chaque paiement |
| Plan Pro client | 990 DH/mois | Abonnement |
| Plan Pro freelance | 490 DH/mois | Visibilité boost |
| Featured mission | 200 DH | Mise en avant |
| Urgence matching | 500 DH | Matching prioritaire |

---

## 📅 Phases d'implémentation

### Phase 1 — MVP (maintenant)
- [x] User + Auth magic link
- [x] Mission CRUD basique
- [ ] FreelancerProfile + ClientProfile
- [ ] Proposal flow complet
- [ ] Review après mission

### Phase 2 — Marketplace
- [ ] Messagerie (Conversation + Message)
- [ ] Notifications temps réel
- [ ] Contract + Milestones
- [ ] Invitations
- [ ] Favoris

### Phase 3 — Paiement
- [ ] Intégration CMI/Stripe
- [ ] Escrow (séquestre)
- [ ] Facturation automatique
- [ ] Commission Itqan

### Phase 4 — Scale
- [ ] Disputes
- [ ] Badges & vérification
- [ ] Portfolio public
- [ ] API publique
- [ ] App mobile
