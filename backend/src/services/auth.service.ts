import admin from "firebase-admin";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";
import { FirebaseError } from "firebase-admin/lib/utils/error";

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
    if (error instanceof FirebaseError) {
      if (error.code === "auth/id-token-expired") {
        // Handle expired token specifically
        console.error("Firebase ID token has expired.");
      } else {
        // Handle other Firebase authentication errors
        console.error(`Firebase auth error: ${error.code}`);
      }
    } else {
      // Handle non-Firebase errors (e.g., Prisma errors)
      console.error("An unexpected error occurred:", error);
    }
    return null;
  }
}
