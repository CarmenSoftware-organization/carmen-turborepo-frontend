"use server"
export async function signInAction(email: string, password: string) {
    // Simulate server processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
        console.log("email", email);
        console.log("password", password);

        return {
            success: true,
            message: "Authentication successful"
        }

    } catch (error) {
        console.error("Authentication error:", error)
        return {
            success: false,
            message: "An error occurred during authentication"
        }
    }
} 