import { NextResponse } from "next/server";
import { recentActivity } from "@/mock-data/dashboard";

export async function GET() {
    return NextResponse.json(recentActivity);
}

export const dynamic = 'force-dynamic';