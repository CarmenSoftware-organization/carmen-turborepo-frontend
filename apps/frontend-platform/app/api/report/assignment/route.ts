import { NextResponse } from "next/server";
import { mockReportAssignment } from "../../mock-data";

export async function GET() {
    return NextResponse.json(mockReportAssignment);
}

export const dynamic = 'force-dynamic';