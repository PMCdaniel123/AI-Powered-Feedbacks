import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// API Get User Feedbacks: GET /api/feedbacks
export async function GET() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, feedbacks });
}
