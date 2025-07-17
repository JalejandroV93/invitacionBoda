/*
  Warnings:

  - A unique constraint covering the columns `[guestNumber]` on the table `guests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guestNumber` to the `guests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "guestNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "wedding_config" (
    "id" TEXT NOT NULL,
    "brideName" TEXT NOT NULL DEFAULT 'Novia',
    "groomName" TEXT NOT NULL DEFAULT 'Novio',
    "weddingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ceremonyLocation" TEXT NOT NULL DEFAULT 'Iglesia',
    "ceremonyAddress" TEXT NOT NULL DEFAULT 'Dirección de la ceremonia',
    "ceremonyLat" DOUBLE PRECISION,
    "ceremonyLng" DOUBLE PRECISION,
    "receptionLocation" TEXT NOT NULL DEFAULT 'Salón de fiestas',
    "receptionAddress" TEXT NOT NULL DEFAULT 'Dirección de la recepción',
    "receptionLat" DOUBLE PRECISION,
    "receptionLng" DOUBLE PRECISION,
    "backgroundImage" TEXT,
    "brideImage" TEXT,
    "groomImage" TEXT,
    "coupleImage" TEXT,
    "welcomeMessage" TEXT NOT NULL DEFAULT '¡Nos casamos!',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_guestNumber_key" ON "guests"("guestNumber");
