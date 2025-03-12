import { NextResponse } from "next/server";
import { mockBusinessUnits } from "../mock-data";

export const dynamic = 'force-dynamic'
export async function GET() {
    return NextResponse.json(mockBusinessUnits);
}


