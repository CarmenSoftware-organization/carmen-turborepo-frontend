import { NextResponse } from "next/server";
import { mockAccessControl } from "../../mock-data";
export const dynamic = 'force-dynamic';
export async function GET() {
    return NextResponse.json(mockAccessControl);
}


