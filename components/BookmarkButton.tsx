"use client";
import React from "react";
import { FaBookmark } from "react-icons/fa";
import Property from "@/types/IProperty";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const BookmarkButton = ({ property }: { property: Property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You must be logged in to bookmark a property");
      return;
    }

    try {
      const res = await fetch(`/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
          userId: userId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        setIsBookmarked(data.isBookmarked);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to bookmark property");
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const checkIfBookmarked = async () => {
      try {
        const res = await fetch(`/api/bookmarks/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property._id,
            userId: userId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkIfBookmarked();
  }, [property._id, userId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return isBookmarked ? (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" />
      Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" />
      Bookmark Property
    </button>
  );
};

export default BookmarkButton;
