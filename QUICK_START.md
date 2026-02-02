# FreelancerProfileCard - Quick Start Guide

## 🚀 Quick Usage

### Basic Example (New API)

```tsx
import { FreelancerProfileCard, type StatConfig } from "@/components/ui/freelancer-profile-card"
import { Badge } from "@/components/ui/badge"
import { Star, Briefcase, DollarSign } from "lucide-react"

const stats: StatConfig[] = [
  { icon: Star, value: "4.5", label: "note" },
  { icon: Briefcase, value: "3", label: "missions" },
  { icon: DollarSign, value: "500 MAD", label: "TJM" }
]

const skills = (
  <>
    <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
      React
    </Badge>
    <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
      TypeScript
    </Badge>
  </>
)

const badges = (
  <Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
    Vérifié
  </Badge>
)

<FreelancerProfileCard
  name="Ahmed Benali"
  title="Full Stack Developer"
  avatarSrc="https://ui-avatars.com/api/?name=Ahmed+Benali&background=a3e635&color=1a1a1a"
  bannerSrc="data:image/svg+xml,..."
  stats={stats}
  skills={skills}
  badges={badges}
  buttonLabel="Contacter"
  onGetInTouch={() => console.log("Contact")}
/>
```

### Backward Compatible (Old API)

```tsx
<FreelancerProfileCard
  name="Ahmed Benali"
  title="Full Stack Developer"
  avatarSrc="..."
  bannerSrc="..."
  rating={4.5}
  duration="3 missions"
  rate="500 MAD/j"
  tools={<Badge>React</Badge>}
  buttonLabel="Contacter"
  onGetInTouch={() => {}}
/>
```

## 📊 Common Stat Configurations

### Browse Page
```tsx
{ icon: Star, value: "4.5", label: "note" }
{ icon: Briefcase, value: "3", label: "missions" }
{ icon: DollarSign, value: "500 MAD", label: "TJM" }
```

### Proposal View
```tsx
{ icon: Star, value: "4.7", label: "note" }
{ value: "15000 MAD", label: "offre" }
{ icon: Clock, value: "10j", label: "délai" }
```

### Admin Dashboard
```tsx
{ icon: Star, value: "4.8", label: "note" }
{ icon: TrendingUp, value: "45000 MAD", label: "revenu total" }
{ icon: Award, value: "12", label: "missions" }
```

## 🎨 Badge Presets

### Verified
```tsx
<Badge className="bg-lime-400/10 text-lime-400 border border-lime-400/20 text-[10px]">
  Vérifié
</Badge>
```

### Available
```tsx
<Badge className="bg-green-400/10 text-green-400 border border-green-400/20 text-[10px]">
  Disponible
</Badge>
```

### Top Rated
```tsx
<Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[10px]">
  Top Rated
</Badge>
```

### Premium
```tsx
<Badge className="bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[10px]">
  Premium
</Badge>
```

## 🎯 Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✅ | Freelancer name |
| `title` | `string` | ✅ | Job title/role |
| `avatarSrc` | `string` | ✅ | Avatar image URL |
| `bannerSrc` | `string` | ✅ | Banner image URL |
| `stats` | `StatConfig[]` | ❌ | Flexible stats array |
| `skills` | `ReactNode` | ❌ | Skill badges |
| `badges` | `ReactNode` | ❌ | Status badges |
| `buttonLabel` | `string` | ❌ | Button text (default: "Get in touch") |
| `onGetInTouch` | `() => void` | ❌ | Button click handler |
| `onBookmark` | `() => void` | ❌ | Bookmark click handler |
| `hideButton` | `boolean` | ❌ | Hide action button |
| `hideBookmark` | `boolean` | ❌ | Hide bookmark icon |

### Legacy Props (Deprecated, use `stats` instead)
| Prop | Type | Description |
|------|------|-------------|
| `rating` | `number` | Auto-converted to stats |
| `duration` | `string` | Auto-converted to stats |
| `rate` | `string` | Auto-converted to stats |
| `tools` | `ReactNode` | Alias for `skills` |

## 🔧 Tips

1. **Use UI Avatars for fallback:**
   ```ts
   `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a3e635&color=1a1a1a`
   ```

2. **Use gradient banner:**
   ```ts
   "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a3e635;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23a3e635;stop-opacity:0.1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23grad)' /%3E%3C/svg%3E"
   ```

3. **Grid layout:**
   ```tsx
   <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {/* cards */}
   </div>
   ```

## 📚 More Examples

See `freelancer-profile-card.examples.tsx` for 6 complete usage examples!
