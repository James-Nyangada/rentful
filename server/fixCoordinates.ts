import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const locations = await prisma.$queryRaw<any[]>`
    SELECT id, ST_AsText(coordinates) as coords FROM "Location"
  `;

  let updatedCount = 0;
  for (const loc of locations) {
    if (loc.coords === "POINT(0 0)") {
      await prisma.$executeRaw`
        UPDATE "Location"
        SET coordinates = ST_SetSRID(ST_MakePoint(36.8219, -1.2921), 4326)
        WHERE id = ${loc.id}
      `;
      updatedCount++;
      console.log(`Updated location ID ${loc.id} to Nairobi coordinates`);
    }
  }
  
  console.log(`Finished updating ${updatedCount} locations.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
