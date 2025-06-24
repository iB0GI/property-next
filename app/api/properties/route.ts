import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import getSessionUser from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

export const dynamic = "force-dynamic";

//GET /api/propeties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;

    const skip = (Number(page) - 1) * Number(pageSize);

    const total = await Property.countDocuments({});

    const properties = await Property.find({})
      .skip(skip)
      .limit(Number(pageSize));

    const result = {
      total,
      properties,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user)
      return new NextResponse("User Id is required", { status: 401 });

    const userId = sessionUser.user.id;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image) => image instanceof File && image.name !== "");

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
      images: [] as string[],
    };

    const imageUploadPromises = [];

    for (const image of images) {
      if (image instanceof File) {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        const imageBase64 = imageData.toString("base64");

        const dataUri = `data:image/png;base64,${imageBase64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "property_next",
        });
        imageUploadPromises.push(result.secure_url);
      }
    }
    const uploadedImages = await Promise.all(imageUploadPromises);
    propertyData.images = uploadedImages;

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
