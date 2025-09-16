import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth/token";

const api = axios.create({
  baseURL: "https://blogperigericobackend.azurewebsites.net",
  timeout: 15000,
});

// rotas públicas (não devem receber Authorization)
const isPublic = (url = "") =>
  url.startsWith("/auth/login") ||
  url.startsWith("/usuarios/salvar") ||
  url.startsWith("/auth/esqueci-senha") ||
  url.startsWith("/auth/redefinir-senha");

// util: detectar FormData sem depender de instanceof (que às vezes falha)
const isFormData = (data) =>
  data &&
  typeof data === "object" &&
  typeof data.append === "function" &&
  typeof data.get === "function";

api.interceptors.request.use(async (config) => {
  config.headers = { ...(config.headers || {}) };

  // ⚠️ só defina JSON se NÃO for FormData
  if (!isFormData(config.data)) {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
  } else {
    // deixe o Axios setar boundary automaticamente
    delete config.headers["Content-Type"];
  }

  // injeta token em rotas privadas
  if (!isPublic(config.url)) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  // logs úteis
  try {
    console.log(
      "📤 [REQ]",
      (config.method || "GET").toUpperCase(),
      (config.baseURL || "") + (config.url || "")
    );
    if (config.data) {
      if (isFormData(config.data)) {
        // log leve de FormData
        const parts = [];
        // @ts-ignore
        for (const p of config.data?._parts || []) parts.push(p[0]);
        console.log("   body: FormData(", parts.join(", "), ")");
      } else {
        console.log("   body:", JSON.stringify(config.data));
      }
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
export { TOKEN_KEY };
