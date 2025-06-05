import { useMutation } from "@tanstack/react-query";
import { signInService } from "@/services/auth.service";
import { SignInFormValues } from "@/dtos/sign-in.dto";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useSignInMutation = () => {
    const { setSession } = useAuth();
    const t = useTranslations('SignInPage');

    return useMutation({
        mutationFn: async (values: SignInFormValues) => {
            const result = await signInService(values.email, values.password);
            if (!result) {
                throw new Error(t('signInError'));
            }
            return result;
        },
        onSuccess: (data) => {
            if (data.access_token && data.refresh_token) {
                setSession(data.access_token, data.refresh_token);
            }
        },
        onError: (error) => {
            console.error("Sign in error:", error);
            toast.error(t('signInError'));
        }
    });
}; 