import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from 'resend';
import { API_URL } from '@/lib/util/api';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {

        const { subject, email } = await request.json();

        const response = await fetch(API_URL + '/auth/register/email-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        const resultToken = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: resultToken.error || 'email token failed' },
                { status: response.status }
            );
        }

        const token = resultToken.data

        const { data, error } = await resend.emails.send({
            from: 'test@mail.semapru.com',
            to: email,
            subject: subject,
            react: EmailTemplate({ email: email, token: token }),
        });

        if (error) {
            return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}