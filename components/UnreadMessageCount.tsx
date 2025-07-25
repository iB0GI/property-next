import { Session } from "inspector/promises";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = ({ session }: any) => {
  const { unreadCount, setUnreadCount } = useGlobalContext();

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/messages/unread-count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data);
        }
      } catch (error) {
        console.log("Error fetching unread message count:", error);
      }
    };

    fetchUnreadMessages();
  }, [session]);

  return (
    unreadCount > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {unreadCount}
      </span>
    )
  );
};

export default UnreadMessageCount;
