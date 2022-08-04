import { PrismaClient } from '@prisma/client'
import menuData from '../../src/db/menuData.js'

const prisma = new PrismaClient()

async function main() {
  for await (const item of menuData) {
    const record = await prisma.menuItem.create({ data: item })
    console.log({ record })
  }
}

try {
  await main()
  await prisma.$disconnect()
} catch (e) {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
}