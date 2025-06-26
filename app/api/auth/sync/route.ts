import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return NextResponse.json({ success: true, existingUser });

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: clerkUser.firstName,
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl,
      },
    });

    return NextResponse.json({ success: true, dbUser });
  } catch (error) {
    console.error("Sync user failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
