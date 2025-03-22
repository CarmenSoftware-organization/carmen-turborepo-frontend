import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Github, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
    rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);
        try {
            // Simulate API call
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Successfully logged in!");
            form.reset();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="space-y-2 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">
                    Enter your credentials to sign in to your account
                </p>
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 animate-slide-up"
                style={{ animationDelay: "100ms" }}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium absolute -top-2 left-2 px-1 bg-background"
                            >
                                Email
                            </Label>
                            <div className="flex items-center">
                                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className={cn(
                                        "pl-10 h-12 transition-all duration-300 bg-background",
                                        form.formState.errors.email && "ring-2 ring-destructive"
                                    )}
                                    {...form.register("email")}
                                />
                            </div>
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive px-1 animate-fade-in">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium absolute -top-2 left-2 px-1 bg-background"
                            >
                                Password
                            </Label>
                            <div className="flex items-center">
                                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300 bg-background",
                                        form.formState.errors.password && "ring-2 ring-destructive"
                                    )}
                                    {...form.register("password")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 h-8 w-8 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm text-destructive px-1 animate-fade-in">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember-me"
                                disabled={isLoading}
                                {...form.register("rememberMe")}
                            />
                            <Label
                                htmlFor="remember-me"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </Label>
                        </div>
                        <Button
                            variant="link"
                            size="sm"
                            className="text-sm font-medium text-primary px-0"
                            disabled={isLoading}
                        >
                            Forgot password?
                        </Button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 transition-all duration-300 font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            Signing in...
                        </div>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="p-0 font-medium">
                        Sign up
                    </Button>
                </p>
            </div>

            <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="animate-slide-up h-12"
                    style={{ animationDelay: "300ms" }}
                >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="animate-slide-up h-12"
                    style={{ animationDelay: "400ms" }}
                >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                </Button>
            </div>
        </div>
    );
}
