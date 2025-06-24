import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

//GET /api/propeties/featured
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const properties = await Property.find({ isFeatured: true });

    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
