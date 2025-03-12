import { NextResponse } from "next/server";
import { mockSettings } from "../mock-data";

export async function GET() {
    return NextResponse.json(mockSettings);
}

