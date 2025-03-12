import { PayloadRecoverPasswordType } from "@/lib/types";
import { API_URL } from "@/lib/util/api";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const payload: PayloadRecoverPasswordType = await request.json();

        const response = await fetch(API_URL + '/v1/auth/forgotpassword/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            return NextResponse.json({ error: "Invalid token or resource not found" }, { status: 404 });
        }
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || "An unknown error occurred" }, { status: response.status });
        }

        return NextResponse.json({
            message: "Payload received successfully", response
        }, { status: 201 });
    } catch (error) {
        console.error("Error handling request:", error);
        return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
    }
}