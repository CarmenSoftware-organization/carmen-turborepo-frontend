'use client';

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function notFound() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleBack();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
            <p className="max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <button
                onClick={handleBack}
                onKeyDown={handleKeyDown}
                className="flex items-center gap-2 p-2 bg-primary text-primary-foreground rounded-md text-base font-medium"
                tabIndex={0}
                aria-label="Go back to previous page"
            >
                <ArrowLeft />
                Go Back
            </button>
        </div>
    );
}
