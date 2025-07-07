import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { FeedbackMode } from "@prisma/client";
import { getDbUserId } from "@/lib/actions/user.action";

// API Create New Feedback: POST /api/feedback
export async function POST(req: Request) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const body = await req.json();
  const { inputText, outputText, mode, conversationId, rating, liked } = body;

  if (!inputText || !mode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!Object.values(FeedbackMode).includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // If user is logged in → save to DB
  if (userId && clerkUser) {
    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: dbUserId,
        conversationId,
        inputText,
        outputText,
        mode,
        rating,
        liked,
      },
    });

    return NextResponse.json({ success: true, feedback });
  }

  // Guest user → fake success (frontend tự quản local)
  return NextResponse.json({ success: true, guest: true });
}

// API Update Feedback: PATCH /api/feedback
export async function PATCH(req: Request) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const body = await req.json();
  const { id, inputText, outputText, mode, conversationId, rating, liked } =
    body;

  if (!id) {
    return NextResponse.json({ error: "Missing feedback ID" }, { status: 400 });
  }

  if (!inputText || !mode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!Object.values(FeedbackMode).includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // If user is logged in → update in DB
  if (userId && clerkUser) {
    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: {
        userId: dbUserId,
        conversationId,
        inputText,
        outputText,
        mode,
        rating,
        liked,
      },
    });

    return NextResponse.json({ success: true, feedback });
  }

  // Guest user → fake success (frontend tự quản local)
  return NextResponse.json({ success: true, guest: true });
}
