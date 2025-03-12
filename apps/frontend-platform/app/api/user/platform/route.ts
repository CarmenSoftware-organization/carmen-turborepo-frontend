import { NextResponse } from "next/server";
import { mockUserPlatform } from "@/app/api/mock-data";

export const dynamic = 'force-dynamic';
export async function GET() {
    return NextResponse.json(mockUserPlatform);
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log('body platform', body);
    return NextResponse.json({ message: 'Platform created successfully' });
}


