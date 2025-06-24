import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

//GET /api/messages
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return NextResponse.json("User id is required", {
        status: 401,
      });

    const { userId } = sessionUser;

    const readMessages = await Message.find({
      recipient: userId,
      read: true,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "email")
      .populate("property", "name");

    const unreadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "email")
      .populate("property", "name");

    const messages = [...readMessages, ...unreadMessages];

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

//POST /api/messages
export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const { email, message, property, recipient } = await request.json();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return NextResponse.json(
        { message: "You must be logged in" },
        {
          status: 401,
        }
      );

    const { user } = sessionUser;

    if (user.id === recipient) {
      return NextResponse.json(
        { message: "You cannot send a message to yourself" },
        {
          status: 400,
        }
      );
    }

    const newMessage = new Message({
      email,
      body: message,
      property,
      recipient,
      sender: user.id,
    });

    await newMessage.save();

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
