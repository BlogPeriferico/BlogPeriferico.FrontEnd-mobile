// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "@auth/token";

const api = axios.create({
  baseURL: "https://backblog.azurewebsites.net",
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
  // Permite inspecionar 4xx/5xx sem cair no catch automaticamente.
  validateStatus: () => true,
});

// --- Helpers ---------------------------------------------------------------

// Obtém pathname seguro, mesmo se a URL vier absoluta, relativa SEM “/”, ou com query.
const getPathname = (url, baseURL) => {
  try {
    // new URL resolve relativo com base no baseURL
    const u = new URL(url, baseURL || "http://dummydomain.local");
    return u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
  } catch {
    // fallback conservador
    return typeof url === "string" && url.startsWith("/") ? url : `/${url ?? ""}`;
  }
};

// Rotas públicas (não recebem Authorization)
const isPublicPath = (pathname = "") => {
  return (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/usuarios/salvar") ||
    pathname.startsWith("/auth/esqueci-senha") ||
    pathname.startsWith("/auth/redefinir-senha")
  );
};

// Detectar FormData (React Native): tem .append ou _parts
const isFormData = (data) =>
  data &&
  typeof data === "object" &&
  (typeof data.append === "function" || Array.isArray(data?._parts));

// Retry simples para 502/503 (1 tentativa, 1s) — opcional
const shouldRetryOnce = (status) => status === 502 || status === 503;

// --- Interceptors ----------------------------------------------------------

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };

  // Content-Type: deixe o boundary quando for FormData
  if (isFormData(config.data)) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  } else if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  // Decide se é rota pública usando pathname normalizado
  const pathname = getPathname(config.url || "", config.baseURL);
  if (!isPublicPath(pathname)) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  // Logs:
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
    try {
      console.log("✅ [RESP]", resp.status, resp.config?.url);
    } catch {}

    // Retry simples para 502/503 uma vez (opcional)
    const cfg = resp.config || {};
    if (shouldRetryOnce(resp.status) && !cfg.__retriedOnce) {
      cfg.__retriedOnce = true;
      await new Promise((r) => setTimeout(r, 1000));
      return api.request(cfg);
    }

    return resp;
  },
  async (error) => {
    // Quando não há response (timeout, DNS, TLS), o data fica undefined — log completo:
    try {
      const info =
        typeof error?.toJSON === "function" ? error.toJSON() : { message: error?.message };
      console.log("❌ [ERR]", {
        status: error?.response?.status,
        url: error?.config?.url,
        code: error?.code, // e.g., ECONNABORTED (timeout)
        message: error?.message,
        info,
        data: error?.response?.data, // se vier HTML do gateway, cai aqui
      });
    } catch {}
    return Promise.reject(error);
  }
);

export default api;

// --- Exemplo de uso --------------------------------------------------------
// Mantém perto para facilitar padronização do fluxo.
export async function login(email, senha) {
  const res = await api.post("/auth/login", { email, senha });
  if (res.status >= 200 && res.status < 300 && res.data?.token) {
    await AsyncStorage.setItem(TOKEN_KEY, res.data.token);
  }
  return res;
}
