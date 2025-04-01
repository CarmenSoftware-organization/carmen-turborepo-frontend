import { Button } from "./ui/button";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    onRetry?: () => void;
    onLogin?: () => void;
}

export const UnauthorizedMessage = ({ onRetry, onLogin }: Props) => {
    const t = useTranslations("Common");

    return (
        <div className="w-full py-8 flex flex-col items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("unauthorized")}</AlertTitle>
                <AlertDescription>
                    {t("unauthorizedMessage")}
                </AlertDescription>
            </Alert>

            <div className="flex gap-3 mt-4">
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        data-id="unauthorized-retry-button"
                    >
                        {t("retry")}
                    </Button>
                )}
                {onLogin && (
                    <Button
                        size="sm"
                        onClick={onLogin}
                        data-id="unauthorized-login-button"
                    >
                        {t("signIn")}
                    </Button>
                )}
            </div>
        </div>
    );
};