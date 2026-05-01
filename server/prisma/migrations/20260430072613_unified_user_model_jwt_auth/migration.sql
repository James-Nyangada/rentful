/*
  Warnings:

  - You are about to drop the column `tenantCognitoId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `tenantCognitoId` on the `Lease` table. All the data in the column will be lost.
  - You are about to drop the column `managerCognitoId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenantUserId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantUserId` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerUserId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('tenant', 'manager', 'superadmin');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_tenantCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_tenantCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_managerCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "_TenantFavorites" DROP CONSTRAINT "_TenantFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_B_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "tenantCognitoId",
ADD COLUMN     "tenantUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lease" DROP COLUMN "tenantCognitoId",
ADD COLUMN     "tenantUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "managerCognitoId",
ADD COLUMN     "managerUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "Tenant";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "authId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'tenant',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "verificationCodeExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_managerUserId_fkey" FOREIGN KEY ("managerUserId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_tenantUserId_fkey" FOREIGN KEY ("tenantUserId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_tenantUserId_fkey" FOREIGN KEY ("tenantUserId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantFavorites" ADD CONSTRAINT "_TenantFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantProperties" ADD CONSTRAINT "_TenantProperties_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
