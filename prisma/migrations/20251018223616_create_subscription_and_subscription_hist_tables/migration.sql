-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions_hist" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT NOT NULL,

    CONSTRAINT "subscriptions_hist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions_company_id_idx" ON "subscriptions"("company_id");

-- CreateIndex
CREATE INDEX "subscriptions_start_date_end_date_idx" ON "subscriptions"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions"("created_at");

-- CreateIndex
CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_company_id_key" ON "subscriptions"("company_id");

-- CreateIndex
CREATE INDEX "subscriptions_hist_company_id_idx" ON "subscriptions_hist"("company_id");

-- CreateIndex
CREATE INDEX "subscriptions_hist_start_date_end_date_idx" ON "subscriptions_hist"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "subscriptions_hist_created_at_idx" ON "subscriptions_hist"("created_at");

-- CreateIndex
CREATE INDEX "subscriptions_hist_updated_at_idx" ON "subscriptions_hist"("updated_at");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions_hist" ADD CONSTRAINT "subscriptions_hist_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
