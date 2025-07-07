import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function getOrCreateUser() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      throw new Error("No user found");
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: clerkUser.firstName,
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Failed to get or create user", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    return user;
  } catch (error) {
    console.log("Failed to get user by Clerk ID", error);
  }
}

export async function getDbUserId() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await getUserByClerkId(userId);
    if (!user) return null;

    return user.id;
  } catch (error) {
    console.log("Failed to get DB user ID", error);
  }
}
