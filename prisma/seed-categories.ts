import { PrismaClient } from '@prisma/client';
import { categories } from '../src/lib/categories';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  let count = 0;

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];

    // Level 0: root category
    const root = await prisma.category.upsert({
      where: { slug: cat.value },
      update: {
        name: cat.label,
        nameAr: cat.labelAr ?? null,
        icon: cat.icon ?? null,
        level: 0,
        order: i,
        parentId: null,
      },
      create: {
        slug: cat.value,
        name: cat.label,
        nameAr: cat.labelAr ?? null,
        icon: cat.icon ?? null,
        level: 0,
        order: i,
        parentId: null,
      },
    });
    count++;

    for (let j = 0; j < cat.subcategories.length; j++) {
      const sub = cat.subcategories[j];

      // Level 1: subcategory
      const subCat = await prisma.category.upsert({
        where: { slug: sub.value },
        update: {
          name: sub.label,
          nameAr: sub.labelAr ?? null,
          level: 1,
          order: j,
          parentId: root.id,
        },
        create: {
          slug: sub.value,
          name: sub.label,
          nameAr: sub.labelAr ?? null,
          level: 1,
          order: j,
          parentId: root.id,
        },
      });
      count++;

      if (sub.children) {
        for (let k = 0; k < sub.children.length; k++) {
          const child = sub.children[k];

          // Level 2: sub-subcategory
          await prisma.category.upsert({
            where: { slug: child.value },
            update: {
              name: child.label,
              nameAr: child.labelAr ?? null,
              level: 2,
              order: k,
              parentId: subCat.id,
            },
            create: {
              slug: child.value,
              name: child.label,
              nameAr: child.labelAr ?? null,
              level: 2,
              order: k,
              parentId: subCat.id,
            },
          });
          count++;
        }
      }
    }
  }

  console.log(`  ✅ Categories seeded: ${count}`);
}

seedCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
