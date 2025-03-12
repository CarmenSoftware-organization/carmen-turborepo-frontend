import { toastError } from "@/components/ui-custom/Toast";
import { AuthState, PayloadRecoverPasswordType, PayloadVerifyType, SignInResponse, SignInType } from "@/lib/types";

export const signInAction = async (
    data: SignInType
): Promise<SignInResponse> => {
    const response = await fetch(`api/auth/sign-in`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
    }
    return response.json();
};

type LoginHandler = (data: AuthState, token: string) => void;

export const processLogin = async (
    result: SignInResponse,
    loginHandler: LoginHandler
) => {
    await loginHandler(
        {
            user: {
                id: result.id,
                username: result.username,
            },
            refresh_token: result.refresh_token,
            access_token: result.access_token,
            tenant: result.tenant.map((t) => ({
                ...t,
                is_default: false,
            })),
        },
        result.access_token
    );
};

export const handleSignInException = (error: unknown): void => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toastError({ message: errorMessage });
};


export const sendVerificationEmail = async (email: string) => {
    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: "Register",
                email: email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send verification email');
        }

        return data;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            error: error instanceof Error ? error.message : 'Failed to send verification email'
        };
    }
};

export const submitSignup = async (payload: PayloadVerifyType) => {
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true, data: result };
        } else {
            return { success: false, message: result.message || 'Unknown error' };
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return { success: false, message: 'An error occurred while processing your request' };
    }
};

export const sendRecoverPasswordEmail = async (email: string) => {
    try {
        const response = await fetch('/api/auth/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: "Recover Password",
                email: email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send verification email');
        }

        return data;

    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            error: error instanceof Error ? error.message : 'Failed to send verification email'
        };
    }
};


export const submitForgotPassword = async (payload: PayloadRecoverPasswordType) => {
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true, data: result };
        } else {
            return { success: false, message: result.message || 'Unknown error' };
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return { success: false, message: 'An error occurred while processing your request' };
    }
};