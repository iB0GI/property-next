import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

//GET /api/propeties
export const GET = async (request: NextRequest, props: Props) => {
  try {
    const params = await props.params;
    await connectDB();
    const property = await Property.findById(params.id);

    if (!property)
      return new NextResponse("Property not found", { status: 404 });

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, props: Props) => {
  try {
    const params = await props.params;
    const propertyId = params.id;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId)
      return new NextResponse("User Id is required", { status: 401 });

    const { userId } = sessionUser;

    await connectDB();
    const property = await Property.findById(propertyId);

    if (!property)
      return new NextResponse("Property not found", { status: 404 });

    if (property.owner.toString() !== userId)
      return new NextResponse("Unauthorized", { status: 401 });

    await property.deleteOne();

    return NextResponse.json("Property deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

//PUT /api/propeties/:id
export const PUT = async (request: NextRequest, props: Props) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user)
      return new NextResponse("User Id is required", { status: 401 });

    const { id } = await props.params;
    const userId = sessionUser.user.id;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");

    //Get property to update
    const existingProperty = await Property.findById(id);

    if (!existingProperty) {
      return new NextResponse("Property doesn't exist", { status: 404 });
    }

    if (existingProperty.owner.toString() !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities: amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
