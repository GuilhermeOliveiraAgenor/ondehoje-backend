-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "advertisement_id" TEXT,
    "gateway" TEXT,
    "checkout_id" TEXT,
    "amount" INTEGER NOT NULL,
    "tax" INTEGER,
    "status" TEXT NOT NULL,
    "link" TEXT,
    "method" TEXT,
    "pix_data" TEXT,
    "final_card" TEXT,
    "confirmation_date" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payments_subscription_id_idx" ON "payments"("subscription_id");

-- CreateIndex
CREATE INDEX "payments_advertisement_id_idx" ON "payments"("advertisement_id");

-- CreateIndex
CREATE INDEX "payments_gateway_checkout_id_idx" ON "payments"("gateway", "checkout_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gateway_checkout_id_key" ON "payments"("gateway", "checkout_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_advertisement_id_fkey" FOREIGN KEY ("advertisement_id") REFERENCES "advertisements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
