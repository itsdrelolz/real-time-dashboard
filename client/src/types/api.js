/**
 * Represents the User object provided by Supabase Auth.
 * @typedef {object} SupabaseUser
 * @property {string} id - The user's unique UUID.
 * @property {string} email
 * @property {string} created_at
 * // ... other Supabase user properties as needed
 */

/**
 * Represents the Session object provided by Supabase.
 * @typedef {object} SupabaseSession
 * @property {string} access_token
 * @property {string} token_type
 * @property {number} expires_in
 * @property {string} refresh_token
 * @property {SupabaseUser} user
 */

/**
 * =================================================================
 * PRISMA MODEL TYPES
 * =================================================================
 */

/**
 * Represents a user's public profile, stored in your database.
 * This corresponds to the `Profile` model in Prisma.
 * @typedef {object} Profile
 * @property {string} id - The user's unique UUID (matches Supabase auth user ID).
 * @property {string} email
 * @property {'ADMIN' | 'MEMBER'} role
 * @property {string | null} [firstName]
 * @property {string | null} [lastName]
 * @property {string} displayName
 */

/**
 * Represents a project.
 * Corresponds to the `Project` model in Prisma.
 * @typedef {object} Project
 * @property {number} id
 * @property {string} name
 * @property {string} ownerId - UUID of the profile that owns the project.
 * @property {Profile} [owner] - The owner's profile (available on specific queries).
 * @property {ProjectMember[]} [members] - List of members in the project.
 * @property {Task[]} [tasks] - List of tasks in the project.
 * @property {Channel[]} [channels] - List of channels in the project.
 */

/**
 * Represents the link between a Profile and a Project.
 * Corresponds to the `ProjectMember` model in Prisma.
 * @typedef {object} ProjectMember
 * @property {number} projectId
 * @property {string} profileId
 * @property {Profile} [profile] - The profile of the member.
 */

/**
 * Represents a task within a project.
 * Corresponds to the `Task` model in Prisma.
 * @typedef {object} Task
 * @property {number} id
 * @property {string} title
 * @property {string | null} [description]
 * @property {'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'} status
 * @property {'LOW' | 'MEDIUM' | 'HIGH'} priority
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} projectId
 * @property {string | null} [assigneeId] - UUID of the assigned profile.
 * @property {Profile | null} [assignee] - The profile of the assignee.
 * @property {Channel | null} [channel] - The task-specific channel.
 */

/**
 * Represents a channel for communication.
 * Corresponds to the `Channel` model in Prisma.
 * @typedef {object} Channel
 * @property {number} id
 * @property {string} name
 * @property {string | null} [description]
 * @property {number} projectId
 * @property {number | null} [taskId]
 * @property {Message[]} [messages]
 */

/**
 * Represents a private conversation.
 * Corresponds to the `Conversation` model in Prisma.
 * @typedef {object} Conversation
 * @property {number} id
 * @property {string} createdAt
 * @property {Profile[]} [participants]
 * @property {Message[]} [messages]
 */

/**
 * Represents a single message.
 * Corresponds to the `Message` model in Prisma.
 * @typedef {object} Message
 * @property {number} id
 * @property {string} content
 * @property {string} createdAt
 * @property {string} authorId
 * @property {Profile} [author]
 * @property {number | null} [channelId]
 * @property {number | null} [conversationId]
 */
