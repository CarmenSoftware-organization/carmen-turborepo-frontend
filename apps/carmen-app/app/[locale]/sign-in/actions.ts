"use server"

import { backendApi } from "@/lib/backend-api";

export async function signInAction(email: string, password: string) {
    const apiUrl = `${backendApi}/api/auth/login`

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    }

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
        }

        // Return success with tokens to be stored in client-side sessionStorage
        return {
            success: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token
        }

    } catch (error) {
        console.error("Authentication error:", error)
        return {
            success: false,
            message: "An error occurred during authentication"
        }
    }
} 