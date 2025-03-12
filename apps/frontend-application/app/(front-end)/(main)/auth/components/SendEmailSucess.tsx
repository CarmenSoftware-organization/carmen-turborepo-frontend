import { Button } from '@/components/ui/button';
import React from 'react';

interface Props {
    email: string;
    onResend: () => void;
    isResending: boolean;
}

const SendEmailSuccess: React.FC<Props> = ({ email, onResend, isResending }) => {
    return (
        <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Check Your Email
                </h2>
                <div className="space-y-2">
                    <p className="text-gray-600">
                        We sent a verification link to:
                    </p>
                    <p className="font-medium text-gray-900">
                        {email}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-gray-600 text-center">
                    Click the link in your email to verify your account.
                    If you can&apos;t find the email, check your spam folder or
                </p>
                <div className="text-center">
                    <Button
                        onClick={onResend}
                        disabled={isResending}
                        variant="outline"
                    >
                        {isResending ? 'Sending...' : 'Click here to resend'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SendEmailSuccess;