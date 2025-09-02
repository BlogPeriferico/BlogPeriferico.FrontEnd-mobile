import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

api.interceptors.request.use(async (config) => {
  config.headers = {
    ...(config.headers || {}),
    "Content-Type": "application/json",
  };

  if (!isPublic(config.url)) {
    const token = await AsyncStorage.getItem("@auth/token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  // logs (úteis durante debug)
  try {
    console.log(
      "📤 [REQ]",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );
    if (config.data)
      console.log(
        "   body:",
        typeof config.data === "string"
          ? config.data
          : JSON.stringify(config.data)
      );
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
