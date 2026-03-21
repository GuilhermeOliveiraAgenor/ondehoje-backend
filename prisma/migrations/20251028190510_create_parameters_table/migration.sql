-- CreateTable
CREATE TABLE "parameters" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "key_info" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "parameters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parameters_key_key" ON "parameters"("key");

-- AddForeignKey
ALTER TABLE "parameters" ADD CONSTRAINT "parameters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parameters" ADD CONSTRAINT "parameters_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
