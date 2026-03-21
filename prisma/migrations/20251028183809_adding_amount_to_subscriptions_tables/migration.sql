/*
  Warnings:

  - Added the required column `amount` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `subscriptions_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions_hist" ADD COLUMN     "amount" INTEGER NOT NULL;
