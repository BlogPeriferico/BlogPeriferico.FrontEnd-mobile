import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "@auth/token";

const api = axios.create({
  baseURL: "https://backblog.azurewebsites.net",
  timeout: 15000,
});

// rotas públicas (não devem receber Authorization)
const isPublic = (url = "") =>
  url.startsWith("/auth/login") ||
  url.startsWith("/usuarios/salvar") ||
  url.startsWith("/auth/esqueci-senha") ||
  url.startsWith("/auth/redefinir-senha");

// ✅ detectar FormData do React Native (sem usar .get(); checar _parts também)
const isFormData = (data) =>
  data &&
  typeof data === "object" &&
  (typeof data.append === "function" || Array.isArray(data?._parts));

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };

  // ⚠️ Se for FormData, NÃO defina Content-Type manual (deixe o boundary)
  if (isFormData(config.data)) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  } else {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
  }

  // Injeta token em rotas privadas
  if (!isPublic(config.url)) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  // Logs leves
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
  (resp) => {
    try {
      console.log("✅ [RESP]", resp.status, resp.config?.url);
    } catch {}
    return resp;
  },
  (error) => {
    try {
      const s = error?.response?.status;
      const u = error?.config?.url;
      const d = error?.response?.data;
      console.log("❌ [ERR]", s ?? "-", u ?? "-", "data:", d);
    } catch {}
    return Promise.reject(error);
  }
);

export default api;
