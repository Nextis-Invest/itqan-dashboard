# API Keys Integration Guide

Ce document explique comment `itqan-ma` peut récupérer les clés API stockées dans `app-itqan-dashboard`.

## Options d'intégration

### Option A: API Interne Cross-App (Recommandée)

Créer un endpoint sécurisé dans le dashboard qui expose les clés actives.

**Dashboard side** (`/api/internal/api-keys/route.ts`):

```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Secret partagé entre les deux apps (env variable)
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET

export async function GET(req: NextRequest) {
  // Vérifier le secret
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${INTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const provider = req.nextUrl.searchParams.get("provider")

  const keys = await prisma.apiKey.findMany({
    where: {
      isActive: true,
      ...(provider ? { provider } : {}),
    },
    select: {
      id: true,
      provider: true,
      name: true,
      key: true, // Full key for internal use
      usageCount: true,
      errorCount: true,
    },
    orderBy: [
      { errorCount: "asc" }, // Least errors first
      { usageCount: "asc" }, // Least used first
    ],
  })

  return NextResponse.json(keys)
}

// POST pour reporter usage/errors
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${INTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { keyId, success, error } = await req.json()

  await prisma.apiKey.update({
    where: { id: keyId },
    data: {
      usageCount: { increment: 1 },
      lastUsedAt: new Date(),
      ...(error
        ? {
            errorCount: { increment: 1 },
            lastError: error,
          }
        : {}),
    },
  })

  return NextResponse.json({ success: true })
}
```

**itqan-ma side** (`lib/api-keys.ts`):

```typescript
const DASHBOARD_URL = process.env.DASHBOARD_INTERNAL_URL // e.g., http://localhost:3001
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET

interface ApiKey {
  id: string
  provider: string
  name: string
  key: string
  usageCount: number
  errorCount: number
}

let cachedKeys: ApiKey[] = []
let lastFetch = 0
const CACHE_TTL = 60000 // 1 minute

export async function getApiKey(provider: string): Promise<ApiKey | null> {
  const now = Date.now()
  
  // Refresh cache if stale
  if (now - lastFetch > CACHE_TTL) {
    try {
      const res = await fetch(`${DASHBOARD_URL}/api/internal/api-keys?provider=${provider}`, {
        headers: { Authorization: `Bearer ${INTERNAL_API_SECRET}` },
      })
      if (res.ok) {
        cachedKeys = await res.json()
        lastFetch = now
      }
    } catch (e) {
      console.error("Failed to fetch API keys:", e)
    }
  }

  const providerKeys = cachedKeys.filter(k => k.provider === provider)
  if (providerKeys.length === 0) return null

  // Round-robin ou least-used selection
  return providerKeys[0]
}

export async function reportKeyUsage(keyId: string, success: boolean, error?: string) {
  try {
    await fetch(`${DASHBOARD_URL}/api/internal/api-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTERNAL_API_SECRET}`,
      },
      body: JSON.stringify({ keyId, success, error }),
    })
  } catch (e) {
    console.error("Failed to report key usage:", e)
  }
}
```

**Environment Variables**:

```bash
# Dans les deux apps
INTERNAL_API_SECRET=votre-secret-long-et-securise

# Dans itqan-ma
DASHBOARD_INTERNAL_URL=http://localhost:3001
```

---

### Option B: Shared Database Read

Si les deux apps partagent la même base de données PostgreSQL.

**itqan-ma** (`lib/prisma-shared.ts`):

```typescript
import { PrismaClient } from "@prisma/client"

// Utiliser la même DATABASE_URL que le dashboard
const prisma = new PrismaClient()

export async function getGeminiKey(): Promise<string | null> {
  const key = await prisma.apiKey.findFirst({
    where: {
      provider: "gemini",
      isActive: true,
    },
    orderBy: [
      { errorCount: "asc" },
      { usageCount: "asc" },
    ],
  })
  
  if (key) {
    // Update usage
    await prisma.apiKey.update({
      where: { id: key.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    })
  }

  return key?.key || null
}
```

**Avantages**:
- Simple, pas de latence réseau
- Atomique

**Inconvénients**:
- Couplage fort entre les apps
- Nécessite sync du schema Prisma

---

### Option C: Env Sync (Simple mais moins flexible)

Sync manuelle via script ou CI/CD.

```bash
# Script de sync (run périodiquement ou on-demand)
#!/bin/bash

# Fetch keys from dashboard API
KEYS=$(curl -s -H "Authorization: Bearer $INTERNAL_API_SECRET" \
  "$DASHBOARD_URL/api/internal/api-keys?provider=gemini")

# Extract first active key
GEMINI_KEY=$(echo $KEYS | jq -r '.[0].key')

# Update .env of itqan-ma
echo "GEMINI_API_KEY=$GEMINI_KEY" >> /path/to/itqan-ma/.env.local

# Restart itqan-ma
pm2 restart itqan-ma
```

**Inconvénients**:
- Pas de rotation dynamique
- Redémarrage nécessaire pour changer de clé

---

## Recommandation

**Option A** est recommandée car elle offre:
- Isolation entre les apps
- Rotation dynamique des clés
- Tracking d'usage et d'erreurs en temps réel
- Pas de couplage de schema

## Sécurité

1. **Toujours utiliser HTTPS** en production
2. **Secret fort** pour `INTERNAL_API_SECRET` (min 32 chars)
3. **Rate limiting** sur l'endpoint interne
4. **Logs d'audit** pour tracer les accès aux clés
