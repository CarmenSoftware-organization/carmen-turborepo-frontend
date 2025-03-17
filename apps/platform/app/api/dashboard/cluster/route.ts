import { NextResponse } from "next/server";
import { clusterOverview } from "@/mock-data/dashboard";

export async function GET() {
    return NextResponse.json(clusterOverview);
}

export const dynamic = 'force-dynamic';