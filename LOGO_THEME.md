# Logo Adaptatif au Thème

## Vue d'ensemble

Le logo de l'application s'adapte automatiquement au thème (dark mode / light mode) grâce à un composant réutilisable.

## Composant Logo

**Fichier:** `src/components/ui/logo.tsx`

Le composant `Logo` utilise le hook `useTheme` de `next-themes` pour détecter le thème actuel et afficher la version appropriée du logo :

- **Light Mode:** `/icons/itqan-logo.svg` (logo sombre)
- **Dark Mode:** `/icons/itqan-logo-white.svg` (logo blanc)

### Utilisation

```tsx
import { Logo } from "@/components/ui/logo";

<Logo
  width={120}
  height={40}
  className="h-10 w-auto"
/>
```

### Props

- `width` (number, default: 120) - Largeur du logo
- `height` (number, default: 40) - Hauteur du logo
- `className` (string, default: "h-10 w-auto") - Classes CSS personnalisées
- `alt` (string, default: "Itqan") - Texte alternatif

## Fichiers modifiés

Le composant `Logo` est maintenant utilisé dans les fichiers suivants :

1. `src/components/marketplace/navbar.tsx` - Navigation de la marketplace
2. `src/components/marketplace/footer.tsx` - Footer de la marketplace
3. `src/components/dashboard/sidebar.tsx` - Sidebar du dashboard
4. `src/app/[locale]/(auth)/login/page.tsx` - Page de connexion (4 occurrences)

## Gestion de l'hydratation

Le composant gère correctement l'hydratation SSR/CSR pour éviter les problèmes de mismatch entre le serveur et le client. Pendant le montage initial, un placeholder est affiché pour éviter les erreurs d'hydratation.

## Assets du logo

- `/public/icons/itqan-logo.svg` - Version pour le light mode
- `/public/icons/itqan-logo-white.svg` - Version pour le dark mode

## Notes

- Le composant utilise `resolvedTheme` de `next-themes` pour gérer correctement le mode système
- L'image est chargée avec la prop `priority` pour optimiser le chargement
- Le changement de thème entraîne un changement instantané du logo
