"use client";

import { createContext, useContext, ReactNode } from "react";

type PermissionAction = string;

type UserPermissions = {
  id: string;
  name: string;
  role: string;
  permissions: {
    [module: string]: {
      [submodule: string]: PermissionAction[];
    };
  };
};

type PermissionContextType = {
  user: UserPermissions | undefined;
  userId: string;
};

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

type PermissionProviderProps = {
  children: ReactNode;
  user: UserPermissions | undefined;
  userId: string;
};

export function PermissionProvider({
  children,
  user,
  userId,
}: PermissionProviderProps) {
  return (
    <PermissionContext.Provider value={{ user, userId }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }
  return context;
}
