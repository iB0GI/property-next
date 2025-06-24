"use client";
import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import Property from "@/types/IProperty";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const PropertyContactForm = ({ property }: { property: Property }) => {
  const [email, setEmail] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      message,
      recipient: property.owner,
      property: property._id,
    };

    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        setWasSubmitted(true);
      } else if (res.status === 400 || res.status === 401) {
        const resData = await res.json();
        toast.error(resData.message);
      } else {
        toast.error("Error sending message");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending message");
    } finally {
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>
      {!session ? (
        <p>Please sign in to contact the property manager</p>
      ) : wasSubmitted ? (
        <p className="text-green-500 mb-4">Message submitted</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
              type="submit"
            >
              <FaPaperPlane className="mr-2" /> Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyContactForm;
