# FreelancerProfileCard Integration

## Overview

The `FreelancerProfileCard` component has been successfully integrated into the Itqan dashboard and enhanced to be a **versatile, reusable component** that can be used across multiple contexts.

## 🎯 Key Features

### 1. **Flexible Stats System**
Instead of hardcoded `rating/duration/rate` props, the component now accepts a configurable `stats` array:

```ts
interface StatConfig {
  icon?: React.ElementType;  // Optional icon (Star, DollarSign, etc.)
  value: string | number;    // The stat value
  label: string;             // The stat label
}
```

### 2. **Configurable Badges**
Display contextual badges near the name (Vérifié, Disponible, Top Rated, etc.):

```tsx
<FreelancerProfileCard
  badges={
    <>
      <Badge>Vérifié</Badge>
      <Badge>Disponible</Badge>
    </>
  }
/>
```

### 3. **Skills/Tools Display**
Two props for semantic clarity:
- `skills` (preferred) - displays skills/technologies
- `tools` (backward compatible alias)

### 4. **Customizable Actions**
- `buttonLabel` - customize button text (e.g., "Contacter", "Voir profil", "Gérer")
- `hideButton` - hide the action button entirely
- `hideBookmark` - hide the bookmark icon

### 5. **Backward Compatibility**
Legacy props (`rating`, `duration`, `rate`) still work and are automatically converted to the new stats format.

---

## 📁 Files Created/Modified

### Created:
1. **`src/app/(dashboard)/freelances/freelancer-grid.tsx`**
   - Client component that renders the grid
   - Maps Prisma data to card props
   - Uses the new flexible stats API

2. **`src/components/ui/freelancer-profile-card.examples.tsx`**
   - Comprehensive usage examples
   - Shows 6 different contexts

3. **`FREELANCER_CARD_INTEGRATION.md`**
   - This documentation file

### Modified:
1. **`src/components/ui/freelancer-profile-card.tsx`**
   - Added `StatConfig` interface
   - Added `stats` prop (array of stat configurations)
   - Added `skills` prop (alias for `tools`)
   - Added `badges` prop (React nodes for badges)
   - Added `hideButton` and `hideBookmark` flags
   - Maintained backward compatibility

2. **`src/app/(dashboard)/freelances/page.tsx`**
   - Kept as server component with Prisma
   - Serializes data (Decimal → number)
   - Uses FreelancerGrid client component
   - Preserved header and empty state

---

## 🎨 Usage Contexts

### 1. **Freelances Browse/Listing Page**
Shows: rating, missions count, daily rate (TJM)

```tsx
const stats = [
  { icon: Star, value: "4.5", label: "note" },
  { icon: Briefcase, value: "3", label: "missions" },
  { icon: DollarSign, value: "500 MAD", label: "TJM" }
]
```

### 2. **Proposal View** (Client sees freelancer who proposed)
Shows: rating, offer amount, delivery time

```tsx
const stats = [
  { icon: Star, value: "4.7", label: "note" },
  { value: "15000 MAD", label: "offre" },
  { icon: Clock, value: "10j", label: "délai" }
]
```

### 3. **Admin View**
Shows: rating, total revenue, completed missions

```tsx
const stats = [
  { icon: Star, value: "4.8", label: "note" },
  { icon: TrendingUp, value: "45000 MAD", label: "revenu total" },
  { icon: Award, value: "12", label: "missions" }
]
```

### 4. **Mission Detail** (Assigned freelancer)
Shows: rating, missions, status

```tsx
const stats = [
  { icon: Star, value: "4.9", label: "note" },
  { icon: Briefcase, value: "8", label: "missions" },
  { value: "En cours", label: "statut" }
]
```

---

## 🔧 Technical Details

### Data Serialization
Prisma `Decimal` types are converted to `number` in the server component before passing to the client component:

```ts
const serializedFreelancers = freelancers.map((freelancer) => ({
  // ... other fields
  freelancerProfile: {
    avgRating: freelancer.freelancerProfile.avgRating
      ? Number(freelancer.freelancerProfile.avgRating)
      : null,
    dailyRate: freelancer.freelancerProfile.dailyRate
      ? Number(freelancer.freelancerProfile.dailyRate)
      : null,
  }
}))
```

### Responsive Grid
The grid adapts to screen size:
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns

```tsx
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Animations
Powered by Framer Motion:
- Card entrance animation (fade + slide)
- Hover scale effect
- Staggered content animation

---

## 🎯 Design System

### Theme Integration
- Dark theme with lime-400 accents (matches Itqan dashboard)
- Gradient SVG banner with lime-400 colors
- UI Avatars fallback with lime-400 background

### Badge Styles
```tsx
// Verified badge
<Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20">
  Vérifié
</Badge>

// Available badge
<Badge className="bg-green-400/10 text-green-400 border border-green-400/20">
  Disponible
</Badge>

// Top Rated badge
<Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
  Top Rated
</Badge>
```

---

## ✅ Build Status

```bash
✓ Compiled successfully
✓ All routes generated
✓ TypeScript types valid
```

---

## 📚 Examples

See `src/components/ui/freelancer-profile-card.examples.tsx` for comprehensive usage examples including:

1. Browse page example
2. Proposal view example
3. Admin view example
4. Mission detail example
5. Backward compatibility example
6. Minimal card example

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Add loading skeleton variant
- [ ] Add "featured" variant with different styling
- [ ] Add hover preview with more details
- [ ] Add click analytics tracking
- [ ] Add favorite/bookmark state persistence

---

## 🤝 Contributing

When using this component in new contexts:

1. Define your `stats` array based on the context
2. Create appropriate badges if needed
3. Customize the button label
4. Consider whether bookmark/button should be hidden
5. Test responsive behavior

---

**Last Updated:** 2025-01-XX
**Version:** 1.0.0
**Status:** ✅ Production Ready
