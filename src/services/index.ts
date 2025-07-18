import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired } from "./jwtService";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

api.interceptors.request.use(
  async (config) => {
    const url = config.url || "";
    
    if (
      url.includes("/auth/refresh-token") ||
      url.endsWith("/auth/token") ||
      url.endsWith("/auth/register") ||
      url.endsWith("/auth/login")
    ) {
      return config;
    }
    let token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("You must be logged in to perform that action");
      return Promise.reject(new axios.Cancel("No auth token"));
    }

    if (isTokenExpired(token)) {
      // Token istekao - osveži ga pre slanja zahteva
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          const res = await axios.post(
            "http://localhost:8080/users/auth/refresh-token",
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );
          if (res.status === 200) {
            const { accessToken, refreshToken: newRefreshToken } = res.data;
            localStorage.setItem("jwtToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            api.defaults.headers.common.Authorization = "Bearer " + accessToken;
            onTokenRefreshed(accessToken);
            token = accessToken;
          } else {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(new axios.Cancel("Unable to refresh token"));
          }
        } catch (err) {
          localStorage.clear();
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        await new Promise<string>((resolve) => addRefreshSubscriber(resolve));
        token = localStorage.getItem("jwtToken") || "";
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);