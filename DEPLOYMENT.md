# Guide de Déploiement

## Variables d'environnement en Production

### ⚠️ IMPORTANT - URL de Production

Lors du déploiement en production, assurez-vous de mettre à jour `NEXTAUTH_URL` :

```env
# ❌ NE PAS utiliser en production
NEXTAUTH_URL=http://localhost:3000

# ✅ Utiliser en production
NEXTAUTH_URL=https://app.itqan.ma
```

### Pourquoi c'est important ?

Cette variable est utilisée pour :
- Générer les liens de vérification d'email
- Gérer les redirections OAuth
- Configurer les callbacks NextAuth

### Détection automatique

Le code utilise maintenant une détection automatique basée sur les headers de requête :
1. Header `origin`
2. Header `referer`
3. Variable `NEXTAUTH_URL`
4. Fallback: `https://app.itqan.ma`

Même si `NEXTAUTH_URL` est mal configuré, les liens de vérification utiliseront l'origine de la requête.

## Checklist de Déploiement

- [ ] `NEXTAUTH_URL` configuré avec l'URL de production
- [ ] `NEXTAUTH_SECRET` généré avec une clé sécurisée
- [ ] `DATABASE_URL` pointe vers la DB de production
- [ ] `RESEND_API_KEY` configuré
- [ ] `RESEND_FROM_EMAIL` configuré avec votre domaine
- [ ] Variables OAuth (Google, LinkedIn) configurées
- [ ] `REDIS_URL` configuré si cache activé

## Services Tiers

### Resend
- Domaine vérifié : `discoverly.cc`
- Email d'envoi : `noreply@discoverly.cc`
- Dashboard : https://resend.com/emails

### Base de données
- PostgreSQL sur 84.247.171.40:5633

### Redis Cache
- Hébergé et configuré

## Tests Post-Déploiement

1. **Test de connexion**
   ```bash
   curl https://app.itqan.ma/api/health
   ```

2. **Test de vérification d'email**
   - Créer un compte de test
   - Vérifier que l'email est reçu
   - Cliquer sur le lien de vérification
   - Vérifier la redirection vers le dashboard

3. **Test du debug endpoint**
   ```bash
   curl https://app.itqan.ma/api/debug/verification-status
   ```

## Rollback

En cas de problème, vérifier les logs :
- Logs d'application pour `[Resend Verification]`
- Logs Resend dashboard
- Logs base de données

## Support

Pour toute question sur le déploiement, consulter :
- `EMAIL_VERIFICATION.md` - Documentation de la vérification d'email
- `LOGO_THEME.md` - Documentation du système de logo adaptatif
