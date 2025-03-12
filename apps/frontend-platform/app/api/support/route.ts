import { NextResponse } from "next/server";
import { mockSupport } from "../mock-data";

export const GET = async () => {
    return NextResponse.json(mockSupport);
}

export const dynamic = 'force-dynamic';