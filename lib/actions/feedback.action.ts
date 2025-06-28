import { auth, currentUser } from "@clerk/nextjs/server";
import { FeedbackMode } from "@prisma/client";
import prisma from "../prisma";

type CreateFeedbackParams = {
  inputText: string;
  outputText: string;
  mode: FeedbackMode;
  conversationId: string;
  rating?: number;
  liked?: boolean;
};

export async function createFeedback({
  inputText,
  outputText,
  mode,
  conversationId,
  rating,
  liked,
}: CreateFeedbackParams) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      throw new Error("Unauthorized");
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          name: clerkUser.firstName,
          email: clerkUser.emailAddresses[0].emailAddress,
          image: clerkUser.imageUrl,
        },
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: dbUser.id,
        inputText,
        outputText,
        mode,
        conversationId,
        rating,
        liked,
      },
    });

    return feedback;
  } catch (error) {
    console.log("Failed to create feedback", error);
  }
}
