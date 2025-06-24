import connectDB from "@/config/database";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

//PUT /api/messages/:id
export const PUT = async (request: NextRequest, props: Props) => {
  try {
    const params = await props.params;
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return new NextResponse("User Id is required", { status: 401 });

    const { userId } = sessionUser;

    const message = await Message.findById(params.id);

    if (!message) return new NextResponse("Message not found", { status: 404 });

    if (message.recipient.toString() !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    message.read = !message.read;

    await message.save();

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, props: Props) => {
  try {
    const params = await props.params;
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return new NextResponse("User Id is required", { status: 401 });

    const { userId } = sessionUser;

    const message = await Message.findById(params.id);

    if (!message) return new NextResponse("Message not found", { status: 404 });

    if (message.recipient.toString() !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await message.deleteOne();

    return NextResponse.json("Message deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
