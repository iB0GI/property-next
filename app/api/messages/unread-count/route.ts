import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

//GET /api/messages/unread-count
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return NextResponse.json("User id is required", {
        status: 401,
      });

    const { userId } = sessionUser;

    const count = await Message.find({
      recipient: userId,
      read: false,
    }).countDocuments();

    return NextResponse.json(count, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
