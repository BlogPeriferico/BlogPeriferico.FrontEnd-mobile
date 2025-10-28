// src/services/auth.js
import api from "./api";
import {
  saveToken,
  saveUserId,
  getToken,
  getUserId,
  clearAuth,
} from "./tokenStore";
import { getUserIdByEmail } from "../services/usuario";

/** Decodifica payload do JWT (sem libs externas) */
function decodeJwtPayload(token) {
  try {
    // RN nem sempre tem atob; se não tiver, aborta com null
    const atobFn = globalThis.atob || null;
    if (!atobFn) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atobFn(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
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

// Reexporta utilidades se o app usar em outros lugares
export { getToken, getUserId, clearAuth };
