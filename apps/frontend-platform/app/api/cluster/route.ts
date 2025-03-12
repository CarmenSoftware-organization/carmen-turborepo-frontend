import { NextResponse } from "next/server";
import { getBusinessUnitsWithClusters } from "@/utils/data-merge";

export const dynamic = 'force-dynamic'
export async function GET() {
    const clusters = await getBusinessUnitsWithClusters();
    return NextResponse.json(clusters);
}   