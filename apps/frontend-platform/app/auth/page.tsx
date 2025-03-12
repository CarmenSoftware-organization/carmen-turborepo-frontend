'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const AuthPage = () => {
    const { login, loading, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { email, password } = formData;
            await login(email, password, rememberMe);
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-between p-8 max-w-screen-lg mx-auto">
            {/* Left Section */}
            <div className="text-white space-y-4">
                <h1 className="text-5xl font-bold">Carmen Platform</h1>
            </div>

            {/* Right Section - Login Form */}
            <div className="bg-[#18181b]/70 backdrop-blur-sm rounded-3xl p-8 w-[480px] text-white">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold">Login</h2>
                        <p className="text-gray-400">Welcome to Carmen Platform</p>
                    </div>

                    {(error || authError) && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded">
                            {error || authError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                                    placeholder="Enter your email"

                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="text-primary hover:text-primary/80">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg flex justify-center"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;