import { NextResponse } from "next/server";
import { mappedUsers } from "../mock-data";

export async function GET() {
    return NextResponse.json(mappedUsers);
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log('body menber', body);
    return NextResponse.json({ message: 'Member created successfully' });
}



