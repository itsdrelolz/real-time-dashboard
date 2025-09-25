import prisma from "../../utils/prismaClient";

/**
 * Check if two users share at least one project
 */
export async function canCreateDM(
  userAId: string,
  userBId: string,
): Promise<boolean> {
  const sharedProjects = await prisma.project.findMany({
    where: {
      AND: [
        { members: { some: { profileId: userAId } } },
        { members: { some: { profileId: userBId } } },
      ],
    },
  });

  return sharedProjects.length > 0;
}

/**
 * Get users who share at least one project with the current user (for DM eligibility)
 */
export async function getDMEligibleUsers(userId: string) {
  const sharedProjects = await prisma.project.findMany({
    where: {
      members: { some: { profileId: userId } },
    },
    include: {
      members: {
        include: {
          profile: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Extract unique users from shared projects (excluding current user)
  const eligibleUsers = new Map();

  sharedProjects.forEach((project) => {
    project.members.forEach((member) => {
      if (member.profileId !== userId && !eligibleUsers.has(member.profileId)) {
        eligibleUsers.set(member.profileId, member.profile);
      }
    });
  });

  return Array.from(eligibleUsers.values());
}

/**
 * Create a new conversation between two users (validates shared project membership)
 */
export async function createConversation(userAId: string, userBId: string) {
  // Validate that users share a project
  const canCreate = await canCreateDM(userAId, userBId);
  if (!canCreate) {
    throw new Error("Users must share at least one project to create a DM");
  }

  // Check if conversation already exists
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          profileId: { in: [userAId, userBId] },
        },
      },
    },
    include: {
      participants: true,
    },
  });

  if (existingConversation && existingConversation.participants.length === 2) {
    return existingConversation;
  }

  // Create new conversation
  return await prisma.conversation.create({
    data: {
      participants: {
        create: [{ profileId: userAId }, { profileId: userBId }],
      },
    },
    include: {
      participants: {
        include: {
          profile: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get conversations for a user
 */
export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: {
      participants: {
        some: { profileId: userId },
      },
    },
    include: {
      participants: {
        include: {
          profile: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
