/*
  Warnings:

  - The primary key for the `company_documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `company_document_type_id` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the `company_document_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `document_id` to the `company_documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."company_document_types" DROP CONSTRAINT "company_document_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_document_types" DROP CONSTRAINT "company_document_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_documents" DROP CONSTRAINT "company_documents_company_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_documents" DROP CONSTRAINT "company_documents_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_documents" DROP CONSTRAINT "company_documents_updated_by_fkey";

-- AlterTable
ALTER TABLE "company_documents" DROP CONSTRAINT "company_documents_pkey",
DROP COLUMN "company_document_type_id",
DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "expires_at",
DROP COLUMN "file",
DROP COLUMN "id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "document_id" TEXT NOT NULL,
ADD CONSTRAINT "company_documents_pkey" PRIMARY KEY ("company_id", "document_id");

-- DropTable
DROP TABLE "public"."company_document_types";

-- CreateTable
CREATE TABLE "document_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "document_type_id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "document_types"("name");

-- CreateIndex
CREATE INDEX "document_types_name_idx" ON "document_types"("name");

-- CreateIndex
CREATE INDEX "document_types_description_idx" ON "document_types"("description");

-- CreateIndex
CREATE INDEX "documents_document_type_id_idx" ON "documents"("document_type_id");

-- CreateIndex
CREATE INDEX "documents_name_idx" ON "documents"("name");

-- CreateIndex
CREATE INDEX "documents_file_idx" ON "documents"("file");

-- CreateIndex
CREATE INDEX "documents_expires_at_idx" ON "documents"("expires_at");

-- CreateIndex
CREATE INDEX "company_documents_document_id_idx" ON "company_documents"("document_id");

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
