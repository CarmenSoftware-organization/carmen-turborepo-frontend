"use client";

import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { backendApi, xAppId } from "@/lib/backend-api";

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
  data: {
    id: string;
    email: string;
    user_info: UserInfo;
    business_unit: BusinessUnit[];
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isLoginLoading: boolean;
  error: Error | null;
  loginError: Error | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  isAuthenticated: () => boolean;
  loginMutation: ReturnType<typeof useMutation<LoginResponse, Error, LoginCredentials>>;
  handleLogout: () => void;
  clearValue: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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
    if (globalThis.window !== undefined) {
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
      throw new Error("No access token");
    }

    const profileUrl = `${backendApi}/api/user/profile`;

    const response = await fetch(profileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-app-id": xAppId,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await response.json();
    return userData; // ไม่ setUser ที่นี่ ให้ useEffect handle
  };

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
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

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const loginUrl = `${backendApi}/api/auth/login`;

      console.log("loginUrl", loginUrl);

      try {
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-id": xAppId,
          },
          body: JSON.stringify(credentials),
        });

        console.log("res", response);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Login response not ok:", response.status, errorText);
          throw new Error(`Login failed: ${response.status} ${errorText}`);
        }

        const data: LoginResponse = await response.json();
        return data;
      } catch (error) {
        // Handle network errors, CORS issues, or fetch failures
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.error("Network error: Unable to connect to backend API", {
            url: loginUrl,
            backendApi,
            error,
            possibleCauses: [
              "Backend server is not running",
              "CORS configuration issue",
              "SSL certificate problem (check browser console)",
              "Network/firewall blocking the connection",
            ],
          });
        }
        throw error;
      }
    },

    onSuccess: async (data: LoginResponse) => {
      const { access_token, refresh_token } = data;

      if (!access_token || !refresh_token) {
        console.error("Missing required data from login response");
        return;
      }

      // Set state และ localStorage
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token);
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refresh_token);

      // Invalidate และ refetch user profile
      try {
        await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        await queryClient.refetchQueries({ queryKey: ["user-profile"] });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }

      router.push("/dashboard");
    },

    onError: (error: Error) => {
      console.error("Login error:", error);
    },
  });

  const handleLogout = useCallback(() => {
    // Clear all states
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // Clear localStorage
    if (globalThis.window !== undefined) {
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.USER);
    }

    // Clear query cache
    queryClient.clear();

    router.push("/auth");
  }, [router, queryClient]);

  // Helper functions
  const login = useCallback(
    (credentials: LoginCredentials): Promise<LoginResponse> => {
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const isAuthenticated = useCallback((): boolean => {
    return !!accessToken;
  }, [accessToken]);

  const clearValue = useCallback((): void => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    if (globalThis.window !== undefined) {
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.USER);
    }
    queryClient.clear();
  }, [queryClient]);

  const value: AuthContextType = useMemo(
    () => ({
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
      clearValue,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isLoading,
      error,
      login,
      isAuthenticated,
      loginMutation,
      handleLogout,
      clearValue,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
