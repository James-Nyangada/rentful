import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDirectory = path.join(__dirname, "prisma", "seedData");
  const managerFilePath = path.join(dataDirectory, "manager.json");
  
  if (!fs.existsSync(managerFilePath)) {
    console.error("Manager seed data not found");
    return;
  }
  
  const managers = JSON.parse(fs.readFileSync(managerFilePath, "utf-8"));
  const dummyAuthIds = managers.map((m: any) => m.authId);
  
  console.log(`Found ${dummyAuthIds.length} dummy managers`);
  
  // Find properties belonging to dummy managers
  const dummyProperties = await prisma.property.findMany({
    where: {
      managerUserId: {
        in: dummyAuthIds
      }
    },
    select: { id: true, locationId: true }
  });
  
  const propertyIds = dummyProperties.map(p => p.id);
  const locationIds = dummyProperties.map(p => p.locationId);
  
  console.log(`Found ${propertyIds.length} dummy properties to delete`);
  
  if (propertyIds.length > 0) {
    // Delete payments
    await prisma.payment.deleteMany({
      where: {
        lease: {
          propertyId: { in: propertyIds }
        }
      }
    });
    console.log("Deleted related payments");
    
    // Delete leases
    await prisma.lease.deleteMany({
      where: {
        propertyId: { in: propertyIds }
      }
    });
    console.log("Deleted related leases");
    
    // Delete applications
    await prisma.application.deleteMany({
      where: {
        propertyId: { in: propertyIds }
      }
    });
    console.log("Deleted related applications");
    
    // Delete properties
    await prisma.property.deleteMany({
      where: {
        id: { in: propertyIds }
      }
    });
    console.log("Deleted properties");
    
    // Delete locations
    await prisma.location.deleteMany({
      where: {
        id: { in: locationIds }
      }
    });
    console.log("Deleted locations");
  }
  
  // Also delete dummy managers and tenants if any
  const tenantFilePath = path.join(dataDirectory, "tenant.json");
  if (fs.existsSync(tenantFilePath)) {
    const tenants = JSON.parse(fs.readFileSync(tenantFilePath, "utf-8"));
    const dummyTenantAuthIds = tenants.map((t: any) => t.authId);
    
    await prisma.user.deleteMany({
      where: {
        authId: { in: [...dummyAuthIds, ...dummyTenantAuthIds] }
      }
    });
    console.log("Deleted dummy users");
  } else {
    await prisma.user.deleteMany({
      where: {
        authId: { in: dummyAuthIds }
      }
    });
    console.log("Deleted dummy managers");
  }
  
  console.log("Finished deleting dummy data");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
