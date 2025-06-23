import connectDB from "@/config/database";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/utils/getSessionUser";
import PropertyModel from "@/models/Property";

export const dynamic = "force-dynamic";

//GET /api/bookmarks

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new NextResponse("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const user = await UserModel.findById(userId);

    const bookmarks = await PropertyModel.find({
      _id: { $in: user.bookmarks },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

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

    let message;

    if (isBookmarked) {
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
      isBookmarked = false;
    } else {
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return NextResponse.json(
      { message, isBookmarked },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
