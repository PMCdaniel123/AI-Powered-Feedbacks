"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Plus, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useGuestConversations } from "@/lib/hooks/useGuestConversations";
import axios from "axios";
import { Sidebar } from "./ui/sidebar";

type Conversation = {
  id: string;
  title: string;
};

export default function SidebarConversation() {
  const { isSignedIn } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const guestConversations = useGuestConversations();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);

      if (isSignedIn) {
        try {
          const res = await axios.get("/api/conversations");
          const data = await res.data;
          if (data.success) setConversations(data.conversations);
        } catch (error) {
          console.error("Error loading conversations", error);
        }
      } else {
        // Guest: load từ local context
        setConversations(guestConversations);
      }

      setLoading(false);
    };

    fetchConversations();
  }, [isSignedIn, guestConversations]);

  return isSignedIn ? (
    <Sidebar>
      <div className="p-4 space-y-4 w-64 border-r h-screen overflow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare size={18} />
            Conversations
          </h2>

          <Link
            href="/new-conversation"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Plus size={16} />
            New
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-4 text-gray-500">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={isSignedIn ? `/conversations/${conversation.id}` : `#`}
                  className="block px-3 py-2 rounded hover:bg-gray-100 text-sm"
                >
                  {conversation.title}
                </Link>
              </li>
            ))}

            {conversations.length === 0 && (
              <p className="text-gray-500 text-sm">No conversations found.</p>
            )}
          </motion.ul>
        )}
      </div>
    </Sidebar>
  ) : null;
}
