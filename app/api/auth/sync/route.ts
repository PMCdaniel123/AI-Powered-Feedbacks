import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/actions/user.action";

export async function POST() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const dbUser = await getOrCreateUser();

    return NextResponse.json({ success: true, dbUser });
  } catch (error) {
    console.error("Sync user failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
