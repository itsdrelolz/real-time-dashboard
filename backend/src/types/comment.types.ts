import type { Comment as PrismaComment } from "@prisma/client";
import type { PublicProfile } from "./profile.types"; 

export type Comment = PrismaComment;

export type CommentWithAuthor = Comment & {
  author: PublicProfile;
};

export type CreateCommentData = Pick<Comment, 'content' | 'taskId' | 'authorId'>;



