import admin from "firebase-admin";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";

export type AuthenticatedUser = {
  uid: string;
  email: string | null;
  profile: User | null;
};

export async function getUserFromToken(
  idToken: string,
): Promise<AuthenticatedUser | null> {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Attempt to retrieve the domain Profile by Firebase UID
    const profile = await prisma.user.findUnique({
      where: { id: decoded.uid },
    });

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      profile: profile ?? null,
    };
  } catch (error) {
    // Token invalid/expired or Admin not initialized
    return null;
  }
}
