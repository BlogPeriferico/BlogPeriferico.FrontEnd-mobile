// src/services/auth.js
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
  return (data?.usuario?.email || data?.user?.email || data?.email || fallbackEmail || null);
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

/** LOGIN: lança erro com status em falha; limpa tokens em qualquer erro */
export async function login({ email, senha }) {
  console.log("📤 [REQ] POST /auth/login");
  const resp = await api.post(
    "/auth/login",
    { email, senha },
    { headers: { Authorization: undefined, "Content-Type": "application/json" } }
  );
  console.log("✅ [RESP]", resp.status, "/auth/login");

  // ❌ falhou → limpa token/uid antigos
  if (resp.status === 401) {
    await clearAuth();
    const err = new Error("E-mail ou senha inválidos.");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  if (resp.status < 200 || resp.status >= 300) {
    await clearAuth();
    const err = new Error(resp?.data?.message || "Falha no login.");
    err.status = resp.status;
    throw err;
  }

  const data = resp.data;
  const token = data?.token || data?.access_token;
  if (!token) {
    await clearAuth();
    const err = new Error("Resposta inválida do servidor (sem token).");
    err.status = 500;
    throw err;
  }

  await saveToken(token);
  console.log("🔑 token salvo");

  // Resolve userId
  let userId = extractNumericIdFromObject(data);
  if (!userId && token) userId = extractNumericIdFromJwt(token);
  if (!userId) {
    const emailToFind = extractEmailFromLoginPayload(data, email);
    try {
      const resolved = await getUserIdByEmail(emailToFind);
      if (resolved != null) userId = resolved;
    } catch {}
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

/** Recuperação de senha */
export async function solicitarCodigo({ email }) {
  console.log("📤 [AUTH] POST /auth/esqueci-senha", { email });
  const resp = await api.post(
    "/auth/esqueci-senha",
    { email },
    { headers: { Authorization: undefined, "Content-Type": "application/json" }, timeout: 30000 } // timeout maior
  );
  if (resp.status < 200 || resp.status >= 300) {
    const err = new Error(resp?.data?.message || "Falha ao solicitar código de recuperação.");
    err.status = resp.status; err.data = resp.data; throw err;
  }
  return resp.data;
}

export async function confirmarCodigoENovaSenha({ email, codigo, novaSenha }) {
  console.log("📤 [AUTH] POST /auth/redefinir-senha", { email, codigo });
  const resp = await api.post(
    "/auth/redefinir-senha",
    { email, codigo, novaSenha },
    { headers: { Authorization: undefined, "Content-Type": "application/json" }, timeout: 30000 }
  );
  if (resp.status < 200 || resp.status >= 300) {
    const err = new Error(resp?.data?.message || "Falha ao redefinir senha.");
    err.status = resp.status; err.data = resp.data; throw err;
  }
  return resp.data;
}
