import { validateRequest } from '@/lib/util/validateRequest';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
interface User {
    id: string;
    username: string;
    email: string;
    picture: string;
    role: string;
    position: string;
}

const mockUsers: User[] = [
    { id: '1', username: 'john_doe', email: 'john@example.com', picture: 'https://example.com/john.jpg', role: 'admin', position: 'Manager' },
    { id: '2', username: 'jane_doe', email: 'jane@example.com', picture: 'https://example.com/jane.jpg', role: 'user', position: 'Developer' },
    { id: '3', username: 'bob_smith', email: 'bob@example.com', picture: 'https://example.com/bob.jpg', role: 'user', position: 'Designer' },
    { id: '4', username: 'alice_jones', email: 'alice@example.com', picture: 'https://example.com/alice.jpg', role: 'admin', position: 'CEO' },
    { id: '5', username: 'charlie_brown', email: 'charlie@example.com', picture: 'https://example.com/charlie.jpg', role: 'user', position: 'QA' },
    { id: '6', username: 'david_wilson', email: 'david@example.com', picture: 'https://example.com/david.jpg', role: 'admin', position: 'CTO' },
    { id: '7', username: 'emily_davis', email: 'emily@example.com', picture: 'https://example.com/emily.jpg', role: 'user', position: 'Marketing' },
    { id: '8', username: 'frank_miller', email: 'frank@example.com', picture: 'https://example.com/frank.jpg', role: 'admin', position: 'Sales' },
    { id: '9', username: 'grace_taylor', email: 'grace@example.com', picture: 'https://example.com/grace.jpg', role: 'user', position: 'HR' },
    { id: '10', username: 'henry_clark', email: 'henry@example.com', picture: 'https://example.com/henry.jpg', role: 'admin', position: 'Developer' },
]

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        const tenantId = request.headers.get('x-tenant-id');

        const validationResult = validateRequest(authHeader, tenantId);
        if (validationResult.error) {
            return NextResponse.json(
                { message: validationResult.error },
                { status: validationResult.status }
            );
        }

        return NextResponse.json({
            message: 'Get user success',
            data: mockUsers
        });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}