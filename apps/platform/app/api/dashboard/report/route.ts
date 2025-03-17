import { NextResponse } from "next/server";
import { reportOverview } from "@/mock-data/dashboard";

export async function GET() {
    return NextResponse.json(reportOverview);
}

export const dynamic = 'force-dynamic';