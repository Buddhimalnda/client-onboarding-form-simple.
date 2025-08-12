import axios, { AxiosInstance } from "axios";

export const apiClient = (token: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/v1",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
      Authorization: `Bearer ${token}`,
    },
  });

export const apiClientV2 = (token: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/v2",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
      Authorization: `Bearer ${token}`,
    },
  });
export const apiClientV2Public = () =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/v2",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
    },
  });
export const apiClientWithoutToken = () =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/v1",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
    },
  });

export const apiAuthWithoutToken = () =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/auth",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
    },
  });
export const apiAuthWithToken = (token: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/auth",
    headers: {
      "Content-Type": "application/json",
      // userId: uid,
      Authorization: `Bearer ${token}`,
    },
  });

// Server-side version of apiClient
// Server-side version of apiClient
export const serverApiClient = (token: string) => {
  // For server-side, we need the full URL
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL + "/api/v1"
    : "http://localhost:3000/api/v1"; // Fallback for local development

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


// back-end
export const backEndApiClient = (token: string) => {
  // For server-side, we need the full URL
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/v1"
    : "http://localhost:9192/api/v1"; // Fallback for local development

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Base API client without authentication (for auth endpoints)
export const publicApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/v1"
    : "http://localhost:9192/api/v1";

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "app_id": process.env.NEXT_PUBLIC_APP_ID || "default-app",
    },
  });
};