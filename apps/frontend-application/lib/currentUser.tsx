"use client";

export const getTenantId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("tenant-id") || "";
  }
  return "";
};

export const setTenantId = (tenantid: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tenant-id", tenantid);
  }
};

export const TenantID = typeof window !== "undefined" ? getTenantId() : "";


export const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA0MzhmZjQ0LTc1NGYtNDJiZC05NWI1LTUzYWFlMjBkZWMzZSIsInVzZXJuYW1lIjoidGVzdDEiLCJpYXQiOjE3MzA5NTQ0MDgsImV4cCI6MTczMDk1ODAwOH0.Mc07zxW3VutuMfM-BffF0nd5w9XnO6VoLTYI56s824A'


