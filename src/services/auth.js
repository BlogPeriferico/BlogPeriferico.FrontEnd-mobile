import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { getUserIdByEmail } from "../services/usuario";

export const TOKEN_KEY = "@auth/token";
export const USERID_KEY = "@auth/userId";

export async function saveToken(token) { try { await AsyncStorage.setItem(TOKEN_KEY, token); } catch {} }
export async function saveUserId(id)   { try { if (id != null) await AsyncStorage.setItem(USERID_KEY, String(id)); } catch {} }
export async function getToken()       { try { return (await AsyncStorage.getItem(TOKEN_KEY)) || null; } catch { return null; } }
export async function getUserId()      { try { return (await AsyncStorage.getItem(USERID_KEY)) || null; } catch { return null; } }
export async function clearAuth()      { try { await AsyncStorage.multiRemove([TOKEN_KEY, USERID_KEY]); } catch {} }

/** Decodifica payload do JWT (sem libs externas) */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}

function extractNumericIdFromObject(obj) {
  const keys = ["id", "userId", "usuarioId", "idUsuario", "uid"];
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && !Number.isNaN(Number(v))) return Number(v);
  }
  return null;
}

function extractEmailFromLoginPayload(data, fallbackEmail) {
  return (
    data?.usuario?.email ||
    data?.user?.email ||
    data?.email ||
    fallbackEmail ||
    null
  );
}

function extractNumericIdFromJwt(token) {
  const p = decodeJwtPayload(token);
  if (!p) return null;
  const keys = ["id", "userId", "usuarioId", "idUsuario", "uid"];
  for (const k of keys) {
    const v = p?.[k];
    if (v != null && !Number.isNaN(Number(v))) return Number(v);
  }
  const sub = p?.sub;
  if (sub != null && !Number.isNaN(Number(sub))) return Number(sub);
  return null;
}

/** LOGIN: salva token e resolve userId:
 *  1) tenta no payload do login / JWT
 *  2) se não achar, busca em /usuarios/listar pelo email
 */
export async function login({ email, senha }) {
  console.log("📤 [REQ] POST /auth/login");
  const { data } = await api.post(
    "/auth/login",
    { email, senha },
    { headers: { Authorization: undefined, "Content-Type": "application/json" } }
  );

  const token = data?.token || data?.access_token || data;
  if (token) {
    await saveToken(token);
    console.log("🔑 token salvo");
  }

  // 1) tenta id no payload/JWT
  let userId = extractNumericIdFromObject(data);
  if (!userId && token) userId = extractNumericIdFromJwt(token);

  // 2) se não encontrou, tenta pelo email em /usuarios/listar
  if (!userId) {
    const emailToFind = extractEmailFromLoginPayload(data, email);
    try {
      const resolved = await getUserIdByEmail(emailToFind);
      if (resolved != null) userId = resolved;
    } catch (e) {
      // se quebrar aqui, segue sem userId (tela de login pode tratar)
    }
  }

  if (userId != null) {
    await saveUserId(userId);
    console.log("👤 userId salvo:", userId);
  } else {
    console.log("⚠️ não foi possível resolver userId automaticamente");
  }

  return data;
}

export async function logout() {
  await clearAuth();
}
