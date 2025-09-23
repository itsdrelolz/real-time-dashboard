import type { Profile as PrismaProfile } from "@prisma/client";

export type Profile = PrismaProfile;

export type PublicProfile = Pick<
  Profile,
  "id" | "username" | "firstName" | "lastName"
>;

export type CreateProfileData = Pick<
  Profile,
  "id" | "email" | "username" | "firstName" | "lastName"
>;