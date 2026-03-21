-- CreateTable
CREATE TABLE "event_images" (
    "event_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("event_id","image_id")
);

-- CreateTable
CREATE TABLE "company_images" (
    "company_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "company_images_pkey" PRIMARY KEY ("company_id","image_id")
);

-- CreateTable
CREATE TABLE "user_images" (
    "user_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "user_images_pkey" PRIMARY KEY ("user_id","image_id")
);

-- CreateIndex
CREATE INDEX "event_images_event_id_idx" ON "event_images"("event_id");

-- CreateIndex
CREATE INDEX "event_images_image_id_idx" ON "event_images"("image_id");

-- CreateIndex
CREATE INDEX "company_images_company_id_idx" ON "company_images"("company_id");

-- CreateIndex
CREATE INDEX "company_images_image_id_idx" ON "company_images"("image_id");

-- CreateIndex
CREATE INDEX "user_images_user_id_idx" ON "user_images"("user_id");

-- CreateIndex
CREATE INDEX "user_images_image_id_idx" ON "user_images"("image_id");

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company_images" ADD CONSTRAINT "company_images_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_images" ADD CONSTRAINT "company_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
