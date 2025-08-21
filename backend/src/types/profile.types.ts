import type { Profile as PrismaProfile } from "@prisma/client";

export type Profile = PrismaProfile;

export type PublicProfile = Pick<Profile, "id" | "displayName">;

export type CreateProfileData = Pick<
  Profile,
  "id" | "email" | "displayName" | "firstName" | "lastName"
>;
