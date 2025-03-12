import { recentActivity } from "@/app/api/mock-data";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export async function GET() {
    return NextResponse.json(recentActivity)
}

