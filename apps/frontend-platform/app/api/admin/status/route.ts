import { statusAdminDashboard } from "@/app/api/mock-data";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.json(statusAdminDashboard);
}