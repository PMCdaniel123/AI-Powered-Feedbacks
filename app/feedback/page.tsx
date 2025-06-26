import { auth } from "@clerk/nextjs/server";

export default async function FeedbackPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please sign in to submit feedback.</div>;
  }

  return (
    <div>
      <h1>Submit Feedback</h1>
      {/* Feedback form component */}
    </div>
  );
}
