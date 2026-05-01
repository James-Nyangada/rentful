import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    include: {
      location: true
    }
  });

  for (const property of properties) {
    const coords: any = await prisma.$queryRaw`SELECT ST_AsText(coordinates) as coords FROM "Location" WHERE id = ${property.locationId}`;
    console.log(`Property ${property.id}: ${property.name}`);
    console.log(`Location: ${property.location.address}, ${property.location.city}`);
    console.log(`Coordinates: ${coords[0].coords}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
