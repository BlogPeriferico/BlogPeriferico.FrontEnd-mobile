// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "./auth";
import { DeviceEventEmitter } from "react-native";

const api = axios.create({
  baseURL: "https://backblog.azurewebsites.net",
  timeout: 15000,
  headers: { Accept: "application/json" },
  validateStatus: () => true,
});

// Helpers
const getPathname = (url, baseURL) => {
  try {
    const u = new URL(url, baseURL || "http://dummydomain.local");
    return u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
  } catch {
    return typeof url === "string" && url.startsWith("/") ? url : `/${url ?? ""}`;
  }
};
const isFormData = (data) =>
  data && typeof data === "object" && (typeof data.append === "function" || Array.isArray(data?._parts));
const isPublicPath = (p = "") =>
  p.startsWith("/auth/login") ||
  p.startsWith("/usuarios/salvar") ||
  p.startsWith("/auth/esqueci-senha") ||
  p.startsWith("/auth/redefinir-senha");

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };

  // Content-Type: não force em FormData
  if (isFormData(config.data)) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  } else if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  const pathname = getPathname(config.url || "", config.baseURL);
  if (!isPublicPath(pathname)) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  try {
    console.log(
      "📤 [REQ]",
      (config.method || "GET").toUpperCase(),
      (config.baseURL || "") + (config.url || "")
    );
    if (isFormData(config.data)) {
      const parts = [];
      // @ts-ignore
      for (const p of config.data?._parts || []) parts.push(p?.[0]);
      console.log("   body: FormData(", parts.filter(Boolean).join(", "), ")");
    } else if (config.data) {
      console.log("   body:", JSON.stringify(config.data));
    }
  } catch {}

  return config;
});

api.interceptors.response.use(
  async (resp) => {
    try { console.log("✅ [RESP]", resp.status, resp.config?.url); } catch {}
    const pathname = getPathname(resp.config?.url || "", resp.config?.baseURL);

    // 401 global fora de rotas públicas → limpar token e avisar UI
    if (resp.status === 401 && !isPublicPath(pathname)) {
      try { await AsyncStorage.removeItem(TOKEN_KEY); } catch {}
      DeviceEventEmitter.emit("auth:invalid-session"); // opcional: ouça e redirecione pro Login
    }
    return resp;
  },
  async (error) => {
    try {
      const info = typeof error?.toJSON === "function" ? error.toJSON() : { message: error?.message };
      console.log("❌ [ERR]", {
        status: error?.response?.status,
        url: error?.config?.url,
        code: error?.code,
        message: error?.message,
        info,
        data: error?.response?.data,
      });
    } catch {}
    return Promise.reject(error);
  }
);

export default api;
