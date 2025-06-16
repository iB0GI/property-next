import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

interface Props{
    params:Promise< {
        id: string;
    }>
}

//GET /api/propeties
export const GET = async (request: NextRequest, props : Props) => {
  try {
    const params = await props.params;
    await connectDB();
    const property = await Property.findById(params.id);

    if(!property) return new NextResponse("Property not found", { status: 404 });

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
