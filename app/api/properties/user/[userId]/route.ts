import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

//GET /api/properties/user/:userId
export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();

    const userId = (await params).userId;

    if (!userId)
      return new NextResponse("User Id is required", { status: 400 });

    const properties = await Property.find({ owner: userId });
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
