'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

// Form validation schema (duplicated from client for server-side validation)
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type SignInResult = {
    success: boolean;
    error?: string;
};

export async function signIn(formData: LoginFormValues): Promise<SignInResult> {
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
        return {
            success: false,
            error: 'Invalid form data. Please check your inputs and try again.',
        };
    }

    const { email, password } = validationResult.data;

    try {
        if (email === 'admin@carmen.com' && password === 'password123') {
            redirect('/dashboard');
        }
        return {
            success: false,
            error: 'Invalid email or password. Please try again.',
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
} 