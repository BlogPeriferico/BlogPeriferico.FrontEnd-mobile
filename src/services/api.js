// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY, getToken } from "./tokenStore";
import { DeviceEventEmitter } from "react-native";

const DEBUG_API = true;

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

/** Rotas públicas (sem Authorization) */
const isPublicPath = (p = "") =>
  p.startsWith("/auth/login") ||
  p.startsWith("/usuarios/salvar") ||
  p.startsWith("/auth/esqueci-senha") ||
  p.startsWith("/auth/redefinir-senha");
// Se quiser: || p.startsWith("/usuarios/listar")

function maskToken(t) {
  if (!t) return "";
  const s = String(t);
  if (s.length <= 12) return "***";
  return s.slice(0, 6) + "..." + s.slice(-6);
}

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };

  const pathname = getPathname(config.url || "", config.baseURL || api.defaults.baseURL);
  const publicRoute = isPublicPath(pathname);

  // Content-Type em FormData
  if (isFormData(config.data)) {
    if (DEBUG_API) console.log("📦[API] isFormData: removendo Content-Type p/ boundary automático");
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  } else if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  // Auth header
  if (!publicRoute) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (DEBUG_API)
        console.log("🔐[API] Auth set", {
          path: pathname,
          method: (config.method || "get").toUpperCase(),
          token: maskToken(token),
        });
    } else {
      if (DEBUG_API)
        console.log("⚠️[API] Sem token p/ rota privada", {
          path: pathname,
          method: (config.method || "get").toUpperCase(),
        });
      delete config.headers.Authorization;
    }
  } else {
    delete config.headers.Authorization;
    if (DEBUG_API)
      console.log("🟢[API] Rota pública", {
        path: pathname,
        method: (config.method || "get").toUpperCase(),
      });
  }

  // Logs da request
  try {
    const full = (config.baseURL || api.defaults.baseURL || "") + (config.url || "");
    console.log("📤 [REQ]", (config.method || "GET").toUpperCase(), full);
    console.log("   headers:", {
      "Content-Type": config.headers["Content-Type"] || config.headers["content-type"],
      Authorization: config.headers.Authorization
        ? "Bearer " + maskToken(config.headers.Authorization.split(" ").pop())
        : undefined,
      Accept: config.headers.Accept,
    });
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
    try {
      const full = (resp.config?.baseURL || api.defaults.baseURL || "") + (resp.config?.url || "");
      console.log("✅ [RESP]", resp.status, full);
    } catch {}
    const pathname = getPathname(resp.config?.url || "", resp.config?.baseURL || api.defaults.baseURL);

    // 401 em rota privada → limpar token e avisar UI
    if (resp.status === 401 && !isPublicPath(pathname)) {
      if (DEBUG_API) console.log("🟥[API] 401 em rota privada → limpando TOKEN_KEY e emitindo 'auth:invalid-session'");
      try { await AsyncStorage.removeItem(TOKEN_KEY); } catch {}
      DeviceEventEmitter.emit("auth:invalid-session");
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

/** Útil pra montar URL absoluta em outros serviços (ex.: fotoPerfil) */
export const getBaseURL = () => (api?.defaults?.baseURL || "").replace(/\/$/, "");

export default api;
