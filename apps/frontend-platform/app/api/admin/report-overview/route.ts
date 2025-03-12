import { NextResponse } from "next/server";
import { reportOverview } from "@/app/api/mock-data";
export const dynamic = 'force-dynamic';
export async function GET() {
    return NextResponse.json(reportOverview);
}