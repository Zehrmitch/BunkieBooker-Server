/*
  Warnings:

  - You are about to drop the column `title` on the `Space` table. All the data in the column will be lost.
  - Added the required column `description` to the `Space` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Space" DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
