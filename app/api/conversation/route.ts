import { getDbUserId } from "@/lib/actions/user.action";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// API Create New Conversation: POST /api/conversation
export async function POST(req: Request) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const body = await req.json();
  const { title } = body;

  if (!userId || !clerkUser) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const dbUserId = await getDbUserId();
  if (!dbUserId) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: dbUserId,
      title: title || "New Conversation",
    },
  });

  return new Response(JSON.stringify({ success: true, conversation }));
}
