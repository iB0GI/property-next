import connectDB from "@/config/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

//GET /api/properties/search
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    const locationPattern = new RegExp(location ?? "", "i");

    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      (query as any).type = typePattern;
    }

    const properties = await Property.find(query);

    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
