import { createFeedback } from "@/lib/actions/feedback.action";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { FeedbackMode } from "@prisma/client";
import { NextResponse } from "next/server";

// POST /api/feedback
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { inputText, outputText, mode, conversationId, rating, liked } = body;

    if (
      !inputText ||
      !outputText ||
      !mode ||
      !conversationId ||
      typeof rating !== "number" ||
      typeof liked !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Object.values(FeedbackMode).includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const feedback = await createFeedback({
      inputText,
      outputText,
      mode,
      conversationId,
      rating,
      liked,
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Sync user failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/feedback or /api/feedback?conversationId=...
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId: dbUser.id,
        ...(conversationId ? { conversationId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        conversation: true,
      },
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Get feedback failed:", error);
    return NextResponse.json({ error: "Failed to get feedbacks" }, { status: 500 });
  }
}
