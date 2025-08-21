'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
            <div className="container max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="text-center lg:text-left space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-8xl lg:text-9xl font-bold text-gray-800 leading-none">
                                404
                            </h1>
                            <div className="space-y-2">
                                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700">
                                    Page Not Found
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                                    Sorry, we couldn't find the page you're looking for.
                                    But don't worry, there's plenty more to explore on our homepage.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                onClick={handleGoHome}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Home className="w-4 h-4" />
                                Back to Homepage
                            </Button>

                            <Button
                                onClick={handleGoBack}
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Animated background elements */}
                            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                                <svg
                                    viewBox="0 0 400 300"
                                    className="w-full h-auto max-w-md"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Simple, modern 404 illustration */}
                                    <rect x="50" y="100" width="300" height="100" rx="20" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                                    <circle cx="200" cy="150" r="30" fill="#ef4444" className="animate-bounce" style={{ animationDelay: '0s' }} />
                                    <rect x="80" y="130" width="60" height="40" rx="8" fill="#3b82f6" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <rect x="260" y="130" width="60" height="40" rx="8" fill="#10b981" className="animate-bounce" style={{ animationDelay: '0.4s' }} />

                                    {/* Floating elements */}
                                    <circle cx="100" cy="60" r="8" fill="#8b5cf6" className="animate-pulse" />
                                    <circle cx="320" cy="70" r="6" fill="#f59e0b" className="animate-pulse" />
                                    <circle cx="80" cy="250" r="4" fill="#ec4899" className="animate-pulse" />
                                    <circle cx="330" cy="240" r="5" fill="#06b6d4" className="animate-pulse" />

                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
