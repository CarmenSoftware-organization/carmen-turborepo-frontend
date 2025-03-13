import { NextResponse } from "next/server";
import { statusDashboard } from "@/mock-data/dashboard";

export async function GET() {
    return NextResponse.json(statusDashboard);
}

export const dynamic = 'force-dynamic';
