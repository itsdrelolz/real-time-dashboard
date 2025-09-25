/*
  Warnings:

  - Added the required column `updatedAt` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Channel" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipientId" TEXT NOT NULL,
    "messageId" TEXT,
    "taskId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPresence" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPresence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageReadStatus" (
    "id" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageReadStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "public"."Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "public"."Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_messageId_idx" ON "public"."Notification"("messageId");

-- CreateIndex
CREATE INDEX "Notification_taskId_idx" ON "public"."Notification"("taskId");

-- CreateIndex
CREATE INDEX "Notification_projectId_idx" ON "public"."Notification"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPresence_userId_key" ON "public"."UserPresence"("userId");

-- CreateIndex
CREATE INDEX "UserPresence_userId_idx" ON "public"."UserPresence"("userId");

-- CreateIndex
CREATE INDEX "UserPresence_status_idx" ON "public"."UserPresence"("status");

-- CreateIndex
CREATE INDEX "UserPresence_lastSeen_idx" ON "public"."UserPresence"("lastSeen");

-- CreateIndex
CREATE INDEX "MessageReadStatus_userId_idx" ON "public"."MessageReadStatus"("userId");

-- CreateIndex
CREATE INDEX "MessageReadStatus_messageId_idx" ON "public"."MessageReadStatus"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReadStatus_userId_messageId_key" ON "public"."MessageReadStatus"("userId", "messageId");

-- CreateIndex
CREATE INDEX "Channel_createdAt_idx" ON "public"."Channel"("createdAt");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "public"."Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt");
