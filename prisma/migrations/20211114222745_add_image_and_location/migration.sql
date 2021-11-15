/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Space` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Space_Type" AS ENUM ('HOUSE', 'ROOM', 'ITEM', 'VEHICLE');

-- CreateEnum
CREATE TYPE "Image_Type" AS ENUM ('COVER', 'PROFILE', 'SPACE');

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "imageUrl",
ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "space_type" "Space_Type" NOT NULL DEFAULT E'HOUSE',
ALTER COLUMN "availability" SET DEFAULT E'Available';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "image_type" "Image_Type" NOT NULL DEFAULT E'SPACE',
    "url" TEXT NOT NULL,
    "description" TEXT,
    "spaceId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
