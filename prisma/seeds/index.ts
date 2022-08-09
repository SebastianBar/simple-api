import { PrismaClient } from '@prisma/client';
import menuData from '../../src/db/menuData.js';

const prisma = new PrismaClient();

async function main() {
  const promises = menuData.map(async (item) => prisma.menuItem.create({
    data: item,
  }));
  await Promise.all(promises);
}

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
