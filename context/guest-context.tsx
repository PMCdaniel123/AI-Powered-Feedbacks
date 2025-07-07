"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

export type GuestFeedback = {
  id: string;
  inputText: string;
  outputText: string;
  mode: string;
  createdAt: string;
  liked?: boolean;
  rating?: number;
};

export type GuestConversation = {
  id: string;
  title: string;
  createdAt: string;
  feedbacks: GuestFeedback[];
};

type GuestContextType = {
  conversations: GuestConversation[];
  addConversation: (title: string) => GuestConversation;
  addFeedback: (
    conversationId: string,
    feedback: Omit<GuestFeedback, "id" | "createdAt">
  ) => void;
};

const GuestContext = createContext<GuestContextType | null>(null);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<GuestConversation[]>([]);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem("guestConversations");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setConversations(parsed);
        }
      } catch (error) {
        console.error(
          "Failed to parse guest conversations from localStorage",
          error
        );
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("guestConversations", JSON.stringify(conversations));
  }, [conversations]);

  const addConversation = (title: string): GuestConversation => {
    const newConversation: GuestConversation = {
      id: uuidv4(),
      title,
      feedbacks: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [...prev, newConversation]);
    return newConversation;
  };

  const addFeedback = (
    conversationId: string,
    feedback: Omit<GuestFeedback, "id" | "createdAt">
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              feedbacks: [
                ...conv.feedbacks,
                {
                  ...feedback,
                  id: uuidv4(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : conv
      )
    );
  };

  return (
    <GuestContext.Provider
      value={{ conversations, addConversation, addFeedback }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuestContext() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuestContext must be used within a GuestProvider");
  }
  return context;
}
