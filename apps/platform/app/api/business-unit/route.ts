import { mockBusinessUnits } from "@/mock-data/bu.data";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(mockBusinessUnits);
}

export const dynamic = 'force-dynamic';

