import { NextResponse } from "next/server";
import { mockTemplateReports } from "@/app/api/mock-data";

export async function GET() {
    return NextResponse.json(mockTemplateReports);
}

export const dynamic = 'force-dynamic';

