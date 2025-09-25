-- CreateIndex
CREATE INDEX "Channel_projectId_idx" ON "public"."Channel"("projectId");

-- CreateIndex
CREATE INDEX "Message_authorId_idx" ON "public"."Message"("authorId");

-- CreateIndex
CREATE INDEX "Message_channelId_idx" ON "public"."Message"("channelId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");

-- CreateIndex
CREATE INDEX "Project_creatorId_idx" ON "public"."Project"("creatorId");

-- CreateIndex
CREATE INDEX "Task_creatorId_idx" ON "public"."Task"("creatorId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "public"."Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "public"."Task"("projectId");
