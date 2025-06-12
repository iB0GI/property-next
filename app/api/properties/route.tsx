import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    return NextResponse.json({message: "Success"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
