import { NextResponse } from "next/server";
import { mockReportBusinessUnit } from "../../mock-data";

export async function GET() {
    return NextResponse.json(mockReportBusinessUnit);
}

export const dynamic = 'force-dynamic';