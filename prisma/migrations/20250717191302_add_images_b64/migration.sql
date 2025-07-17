/*
  Warnings:

  - You are about to drop the column `ceremonyLat` on the `wedding_config` table. All the data in the column will be lost.
  - You are about to drop the column `ceremonyLng` on the `wedding_config` table. All the data in the column will be lost.
  - You are about to drop the column `receptionLat` on the `wedding_config` table. All the data in the column will be lost.
  - You are about to drop the column `receptionLng` on the `wedding_config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wedding_config" DROP COLUMN "ceremonyLat",
DROP COLUMN "ceremonyLng",
DROP COLUMN "receptionLat",
DROP COLUMN "receptionLng",
ADD COLUMN     "ceremonyMapIframe" TEXT,
ADD COLUMN     "receptionMapIframe" TEXT;
