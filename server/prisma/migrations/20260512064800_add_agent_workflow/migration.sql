-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable - Add status and submittedBy to Property
ALTER TABLE "Property" ADD COLUMN "status" "PropertyStatus" NOT NULL DEFAULT 'pending';
ALTER TABLE "Property" ADD COLUMN "submittedBy" TEXT;

-- Set all existing properties to approved (they were already live)
UPDATE "Property" SET "status" = 'approved';

-- CreateTable
CREATE TABLE "SubmissionLink" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionLink_token_key" ON "SubmissionLink"("token");
