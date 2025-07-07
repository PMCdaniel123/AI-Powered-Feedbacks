"use client";

import { useEffect, useState } from "react";

type Conversation = {
  id: string;
  title: string;
};

export function useGuestConversations(): Conversation[] {
  const [guestConversations, setGuestConversations] = useState<Conversation[]>(
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem("guestConversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setGuestConversations(parsed);
      } catch (error) {
        console.error("Failed to parse guest conversations");
      }
    }
  }, []);

  return guestConversations;
}
