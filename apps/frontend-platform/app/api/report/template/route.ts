import { NextResponse } from "next/server";
import { mockReportTemplates } from "../../mock-data";

export async function GET() {
    return NextResponse.json(mockReportTemplates);
}

export const dynamic = 'force-dynamic';