/*
  Warnings:

  - You are about to drop the column `projectId` on the `Channel` table. All the data in the column will be lost.
  - The primary key for the `MessageReadStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `MessageReadStatus` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MessageReadStatus` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Task` table. All the data in the column will be lost.
  - The primary key for the `UserPresence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `UserPresence` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserPresence` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectMembers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workspaceId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Channel_projectId_idx";

-- DropIndex
DROP INDEX "public"."MessageReadStatus_messageId_idx";

-- DropIndex
DROP INDEX "public"."MessageReadStatus_userId_idx";

-- DropIndex
DROP INDEX "public"."MessageReadStatus_userId_messageId_key";

-- DropIndex
DROP INDEX "public"."Task_projectId_idx";

-- DropIndex
DROP INDEX "public"."UserPresence_lastSeen_idx";

-- DropIndex
DROP INDEX "public"."UserPresence_userId_idx";

-- AlterTable
ALTER TABLE "public"."Channel" DROP COLUMN "projectId",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."MessageReadStatus" DROP CONSTRAINT "MessageReadStatus_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD CONSTRAINT "MessageReadStatus_pkey" PRIMARY KEY ("userId", "messageId");

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "projectId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserPresence" DROP CONSTRAINT "UserPresence_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD CONSTRAINT "UserPresence_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "public"."Notification";

-- DropTable
DROP TABLE "public"."NotificationSettings";

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."_ConversationParticipants";

-- DropTable
DROP TABLE "public"."_ProjectMembers";

-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkspaceMember" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("userId","workspaceId")
);

-- CreateTable
CREATE TABLE "public"."ConversationParticipant" (
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("userId","conversationId")
);

-- CreateIndex
CREATE INDEX "Workspace_creatorId_idx" ON "public"."Workspace"("creatorId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_idx" ON "public"."WorkspaceMember"("workspaceId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "public"."ConversationParticipant"("conversationId");

-- CreateIndex
CREATE INDEX "Channel_workspaceId_idx" ON "public"."Channel"("workspaceId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_idx" ON "public"."Task"("workspaceId");
