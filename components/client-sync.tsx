"use client";

import { useEffect } from "react";

export default function ClientSync() {
  useEffect(() => {
    const syncUser = async () => {
      try {
        await fetch("/api/auth/sync", {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to sync user", error);
      }
    };

    syncUser();
  }, []);

  return null;
}
