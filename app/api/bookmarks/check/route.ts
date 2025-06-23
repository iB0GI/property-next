import connectDB from "@/config/database";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new NextResponse("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const user = await UserModel.findById(userId);

    // Check if the property is already bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    return NextResponse.json(
      { isBookmarked },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
