import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    where: { slug: null },
    select: { id: true, name: true },
  });

  console.log(`Found ${properties.length} properties without slugs.`);

  for (const property of properties) {
    const baseSlug = slugify(property.name, { lower: true, strict: true });
    const uniqueSuffix = crypto.randomBytes(3).toString("hex"); // 6 char hex
    const slug = `${baseSlug}-${uniqueSuffix}`;

    await prisma.property.update({
      where: { id: property.id },
      data: { slug },
    });

    console.log(`Property ${property.id} "${property.name}" -> slug: "${slug}"`);
  }

  console.log("Done updating slugs.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
