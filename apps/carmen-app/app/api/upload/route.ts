import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string | null;

    console.log("File details:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });

    console.log("Description:", description);

    return NextResponse.json(formData);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
