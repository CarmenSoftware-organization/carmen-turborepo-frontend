"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CarmenLoading from "./loading/CarmenLoading";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isChangingBu } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const locale = pathname?.split("/")[1];
      router.push(`/${locale}/sign-in`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading state while checking authentication or changing business unit
  if (isLoading || isChangingBu) {
    return <CarmenLoading />;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
