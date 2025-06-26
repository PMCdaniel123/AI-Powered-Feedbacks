import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function getOrCreateUser() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkUser || !userId) throw new Error("No user found");

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
    console.log("Error getting or creating user", error);
  }
}
