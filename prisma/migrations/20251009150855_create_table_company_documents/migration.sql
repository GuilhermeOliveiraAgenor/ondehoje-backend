-- CreateTable
CREATE TABLE "company_documents" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_document_type_id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "company_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_documents_company_id_idx" ON "company_documents"("company_id");

-- AddForeignKey
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_company_document_type_id_fkey" FOREIGN KEY ("company_document_type_id") REFERENCES "company_document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
