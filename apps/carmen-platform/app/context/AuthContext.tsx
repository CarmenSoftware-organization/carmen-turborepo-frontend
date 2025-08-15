"use client";

import React, { useContext, useState, useEffect, createContext, ReactNode, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import { backendApi } from '@/lib/backend-api';

enum LOCAL_STORAGE {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  TENANT_ID = "tenant_id",
  USER = "user",
}

interface UserInfo {
  firstname: string;
  middlename?: string;
  lastname: string;
}

interface BusinessUnit {
  id: string;
  name: string;
  is_default?: boolean;
  department?: {
    id: string;
    is_hod: boolean;
    name: string;
  };
  config?: {
    calculation_method?: string;
    currency_base?: string;
    date_format?: string;
    long_time_format?: string;
    perpage?: number;
    short_time_format?: string;
    timezone?: string;
    amount?: {
      locales: string;
      minimumFractionDigits: number;
    };
    quantity?: {
      locales: string;
      minimumIntegerDigits: number;
    };
    recipe?: {
      locales: string;
      minimumIntegerDigits: number;
    };
  };
}

interface User {
  id: string;
  email: string;
  user_info: UserInfo;
  business_unit: BusinessUnit[];
}

const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Initialize tokens from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN);

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    if (!token) {
      throw new Error('No access token');
    }

    const profileUrl = `${backendApi}/api/user/profile`;

    const response = await fetch(profileUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    return userData; // ไม่ setUser ที่นี่ ให้ useEffect handle
  };

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 นาที
    gcTime: 10 * 60 * 1000, // 10 นาที
  });

  // Update user state เมื่อได้ข้อมูลจาก query
  useEffect(() => {
    if (userData) {
      setUser(userData);
      // Optional: เก็บไว้ใน localStorage เพื่อ offline access
      localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userData));
    }
  }, [userData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const loginUrl = `${backendApi}/api/auth/login`;
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login response not ok:', response.status, errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    },

    onSuccess: async (data: any) => {
      const { access_token, refresh_token } = data;

      if (!access_token || !refresh_token) {
        console.error('Missing required data from login response');
        return;
      }

      // Set state และ localStorage
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refresh_token);

      // Invalidate และ refetch user profile
      try {
        await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        await queryClient.refetchQueries({ queryKey: ['user-profile'] });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }

      router.push("/dashboard");
    },

    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });

  const handleLogout = useCallback(() => {
    // Clear all states
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.USER);
    }

    // Clear query cache
    queryClient.clear();

    router.push("/auth");
  }, [router, queryClient]);

  // Helper functions
  const login = (credentials: any) => {
    return loginMutation.mutateAsync(credentials);
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const clearValue = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.USER);
    }
    queryClient.clear();
  }

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    isLoading: isLoading || loginMutation.isPending,
    isLoginLoading: loginMutation.isPending,
    error,
    loginError: loginMutation.error,
    login,
    isAuthenticated,
    loginMutation,
    handleLogout,
    clearValue
  }), [
    user,
    accessToken,
    refreshToken,
    isLoading,
    loginMutation.isPending,
    error,
    loginMutation.error,
    login,
    isAuthenticated,
    loginMutation,
    handleLogout,
    clearValue
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};