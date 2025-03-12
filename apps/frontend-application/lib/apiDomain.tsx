"use client";

export const getApiDomain = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("api_domain") || "http://localhost:4000";
  }
  return "http://localhost:4000"; // Default value for server-side rendering
};


export const setApiDomain = (apiDomain: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("api_domain", apiDomain);
  }
};

export const ApiDomain =
  typeof window !== "undefined" ? getApiDomain() : "http://localhost:4000";