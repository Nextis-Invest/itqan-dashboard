import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Realistic rating distribution:
 * - 30% have no reviews yet (null rating)
 * - 10% have low ratings (2.0 - 3.5)
 * - 40% have average ratings (3.5 - 4.3)
 * - 15% have good ratings (4.3 - 4.7)
 * - 5% have excellent ratings (4.7 - 5.0)
 */
function generateRealisticRating(): number | null {
  const rand = Math.random()
  
  // 30% - No reviews yet
  if (rand < 0.30) {
    return null
  }
  
  // 10% - Low ratings (struggling freelancers)
  if (rand < 0.40) {
    return Number((Math.random() * 1.5 + 2.0).toFixed(1)) // 2.0 - 3.5
  }
  
  // 40% - Average ratings (majority)
  if (rand < 0.80) {
    return Number((Math.random() * 0.8 + 3.5).toFixed(1)) // 3.5 - 4.3
  }
  
  // 15% - Good ratings
  if (rand < 0.95) {
    return Number((Math.random() * 0.4 + 4.3).toFixed(1)) // 4.3 - 4.7
  }
  
  // 5% - Excellent ratings (top performers)
  return Number((Math.random() * 0.3 + 4.7).toFixed(1)) // 4.7 - 5.0
}

async function main() {
  console.log('🔧 Fixing freelancer ratings...')
  
  const freelancers = await prisma.freelancerProfile.findMany({
    select: { id: true }
  })
  
  console.log(`📊 Found ${freelancers.length} freelancers`)
  
  let updated = 0
  const BATCH_SIZE = 100
  
  for (let i = 0; i < freelancers.length; i += BATCH_SIZE) {
    const batch = freelancers.slice(i, i + BATCH_SIZE)
    
    await Promise.all(
      batch.map(f => 
        prisma.freelancerProfile.update({
          where: { id: f.id },
          data: { avgRating: generateRealisticRating() }
        })
      )
    )
    
    updated += batch.length
    if (updated % 500 === 0) {
      console.log(`✅ Updated ${updated}/${freelancers.length}...`)
    }
  }
  
  console.log('')
  console.log('📊 New rating distribution:')
  
  const stats = await prisma.freelancerProfile.groupBy({
    by: [],
    _count: { id: true },
    _avg: { avgRating: true }
  })
  
  const nullCount = await prisma.freelancerProfile.count({
    where: { avgRating: null }
  })
  
  const ranges = [
    { label: 'Sans avis (null)', min: null, max: null },
    { label: '2.0 - 3.5 ⭐', min: 2.0, max: 3.5 },
    { label: '3.5 - 4.3 ⭐⭐', min: 3.5, max: 4.3 },
    { label: '4.3 - 4.7 ⭐⭐⭐', min: 4.3, max: 4.7 },
    { label: '4.7 - 5.0 ⭐⭐⭐⭐', min: 4.7, max: 5.0 },
  ]
  
  console.log(`   Sans avis: ${nullCount}`)
  
  for (const range of ranges.slice(1)) {
    const count = await prisma.freelancerProfile.count({
      where: {
        avgRating: {
          gte: range.min!,
          lt: range.max === 5.0 ? 5.1 : range.max!
        }
      }
    })
    console.log(`   ${range.label}: ${count}`)
  }
  
  console.log('')
  console.log('🎉 Done!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
