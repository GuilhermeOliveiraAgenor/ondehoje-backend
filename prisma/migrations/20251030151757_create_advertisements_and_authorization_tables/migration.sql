-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "event_id" TEXT,
    "description" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "insights" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisement_authorizations" (
    "id" TEXT NOT NULL,
    "advertisement_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "decided_at" TIMESTAMP(3) NOT NULL,
    "decided_by" TEXT NOT NULL,
    "rejected_reason" TEXT,

    CONSTRAINT "advertisement_authorizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisement_authorizations" ADD CONSTRAINT "advertisement_authorizations_advertisement_id_fkey" FOREIGN KEY ("advertisement_id") REFERENCES "advertisements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisement_authorizations" ADD CONSTRAINT "advertisement_authorizations_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
