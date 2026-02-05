# Système de Vérification d'Email

## Vue d'ensemble

Ce système affiche une bannière de vérification pour les utilisateurs dont l'email n'est pas vérifié et permet de renvoyer l'email de vérification.

## Optimisations

### 1. Cache JWT
- `emailVerified` est stocké dans le JWT token
- Évite les requêtes DB répétées à chaque chargement de page
- Le token est mis à jour lors de la vérification

### 2. Rate Limiting
- Limite l'envoi d'emails à 1 par minute
- Évite les abus et les coûts excessifs

### 3. Session Unique
- La bannière utilise `useSession()` de NextAuth
- Une seule source de vérité pour l'état de vérification

## Composants

### VerificationBanner
**Fichier:** `src/components/verification-banner.tsx`

Bannière client-side qui :
- Vérifie si l'email est vérifié via la session
- Permet de masquer la bannière
- Permet de renvoyer l'email de vérification
- Affiche les messages de succès/erreur

### API Endpoints

#### POST /api/auth/resend-verification
Renvoie l'email de vérification avec :
- Vérification d'authentification
- Rate limiting (1 min)
- Génération de token
- TODO: Envoi d'email (à implémenter)

#### GET /api/auth/verify-email?token=xxx
Vérifie l'email avec :
- Validation du token
- Vérification d'expiration (24h)
- Mise à jour de `emailVerified`
- Redirection vers le dashboard

## Configuration NextAuth

**Fichier:** `src/lib/auth/config.ts`

Modifications :
- JWT callback inclut `emailVerified`
- Session callback expose `emailVerified`
- Support du trigger "update" pour rafraîchir

## Types TypeScript

**Fichier:** `src/types/next-auth.d.ts`

Extension des types NextAuth pour inclure `emailVerified` dans Session et JWT.

## Intégration

La bannière est intégrée dans le layout du dashboard :
```tsx
<SidebarInset>
  <SiteHeader />
  <VerificationBanner />
  <div>{children}</div>
</SidebarInset>
```

## TODO

### Service d'Email
Implémenter l'envoi d'email dans `/api/auth/resend-verification/route.ts` :

```typescript
// Options recommandées :
// - Resend (https://resend.com)
// - SendGrid
// - AWS SES
// - Postmark

await sendEmail({
  to: user.email,
  subject: "Vérifiez votre adresse email - Itqan",
  html: emailTemplate(verificationUrl)
})
```

### Template Email
Créer un template d'email professionnel avec :
- Logo Itqan
- Lien de vérification
- Instructions claires
- Design responsive

## Schéma DB

Champs utilisés dans `User` :
- `emailVerified: DateTime?` - Date de vérification
- `verificationToken: String?` - Token unique
- `verificationTokenExpiry: DateTime?` - Expiration (24h)

## Sécurité

- ✅ Token généré avec `crypto.randomBytes(32)`
- ✅ Expiration de 24 heures
- ✅ Rate limiting (1 minute)
- ✅ Validation côté serveur
- ✅ Token à usage unique (supprimé après vérification)
