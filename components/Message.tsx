"use client";
import IMessage from "@/types/IMessage";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";

const Message = ({ message }: { message: IMessage }) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const { setUnreadCount } = useGlobalContext();

  const handleReadClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "PUT",
      });

      if (res.status === 200) {
        const { read } = await res.json();
        console.log(read);
        setIsRead(read);
        setUnreadCount((prevCount: number) =>
          read ? prevCount - 1 : prevCount + 1
        );
        if (read) {
          toast.success("Message marked as read");
        } else {
          toast.success("Message marked as unread");
        }
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        toast.success("Message deleted");
        setIsDeleted(true);
        setUnreadCount((prevCount: number) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };

  if (isDeleted) return null;

  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white py-1 px-2 rounded-md">
          New
        </div>
      )}
      <h2 className="text-xl mb-4">
        {" "}
        <span className="font-bold">Property Inquiry:</span>{" "}
        {message.property.name}
      </h2>
      <p className="text-gray-700 text-lg">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Reply Email:</strong>
          <a href="mailto:recipient@example.com" className="text-blue-500">
            {" "}
            {message.email}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? "bg-gray-300" : "bg-blue-500 text-white"
        }  py-1 px-3 rounded-md cursor-pointer`}
      >
        {isRead ? "Mark as Unread" : "Mark as Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
};

export default Message;
