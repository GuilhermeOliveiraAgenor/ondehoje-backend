-- DropIndex
DROP INDEX "public"."categories_id_idx";

-- DropIndex
DROP INDEX "public"."categories_name_idx";

-- CreateIndex
CREATE INDEX "advertisement_authorizations_advertisement_id_idx" ON "advertisement_authorizations"("advertisement_id");

-- CreateIndex
CREATE INDEX "advertisements_company_id_idx" ON "advertisements"("company_id");

-- CreateIndex
CREATE INDEX "advertisements_event_id_idx" ON "advertisements"("event_id");

-- CreateIndex
CREATE INDEX "advertisements_status_idx" ON "advertisements"("status");

-- CreateIndex
CREATE INDEX "advertisements_expiration_date_idx" ON "advertisements"("expiration_date");

-- CreateIndex
CREATE INDEX "advertisements_updated_at_idx" ON "advertisements"("updated_at");

-- CreateIndex
CREATE INDEX "informations_company_id_idx" ON "informations"("company_id");

-- CreateIndex
CREATE INDEX "informations_event_id_idx" ON "informations"("event_id");

-- CreateIndex
CREATE INDEX "user_coupons_coupon_id_idx" ON "user_coupons"("coupon_id");
