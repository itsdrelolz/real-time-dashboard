/*
  Warnings:

  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_userName_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "userName";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
