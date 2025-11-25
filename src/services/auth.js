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
      atobFn(base64)
        .split("")
        .map(
          (c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
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

/* ========== LOGIN / LOGOUT ========== */

export async function login({ email, senha }) {
  console.log("📤 [REQ] POST /auth/login");
  const resp = await api.post(
    "/auth/login",
    { email, senha },
    {
      headers: {
        Authorization: undefined,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(" [RESP]", resp.status, "/auth/login");

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

  let userId = extractNumericIdFromObject(data);
  if (!userId && token) userId = extractNumericIdFromJwt(token);

  if (!userId) {
    const emailToFind = extractEmailFromLoginPayload(data, email);
    try {
      const resolved = await getUserIdByEmail(emailToFind);
      if (resolved != null) userId = resolved;
    } catch (e) {
      console.log(
        "⚠️ [auth] falha ao resolver userId por e-mail:",
        e?.message || e
      );
    }
  }

  if (userId != null) {
    await saveUserId(userId);
    console.log("💾 userId salvo:", userId);
  } else {
    console.log("⚠️ [auth] não foi possível resolver userId automaticamente");
  }

  return data;
}

export async function logout() {
  await clearAuth();
}

/* ===== Fluxo de esqueci/redefinir senha ===== */

/**
 * Versão base, recebendo só o e-mail (string).
 * Endpoint: POST /auth/esqueci-senha
 */
export async function solicitarCodigoRedefinicao(email) {
  const emailTrim = String(email || "").trim();
  if (!emailTrim) throw new Error("E-mail é obrigatório");
  console.log("📤 [REQ] POST /auth/esqueci-senha", emailTrim);
  const { data } = await api.post("/auth/esqueci-senha", { email: emailTrim });
  console.log("✅ [RESP] /auth/esqueci-senha", data);
  return data;
}

/**
 * Wrapper compatível com a tela:
 *   solicitarCodigo({ email: "..." })
 */
export async function solicitarCodigo(params) {
  const email =
    typeof params === "string"
      ? params
      : String(params?.email || "").trim();

  if (!email) {
    const err = new Error("E-mail é obrigatório");
    err.code = "EMAIL_REQUIRED";
    throw err;
  }

  return solicitarCodigoRedefinicao(email);
}

/**
 * Redefine a senha usando e-mail + código + novaSenha.
 * Aceita tanto:
 *   redefinirSenha(email, codigo, novaSenha)
 * quanto:
 *   redefinirSenha({ email, codigo, novaSenha })
 */
export async function redefinirSenha(a, b, c) {
  let email;
  let codigo;
  let novaSenha;

  if (typeof a === "object" && a !== null) {
    email = String(a.email || "").trim();
    codigo = String(a.codigo || "").trim();
    novaSenha = String(a.novaSenha || "");
  } else {
    email = String(a || "").trim();
    codigo = String(b || "").trim();
    novaSenha = String(c || "");
  }

  if (!email || !codigo || !novaSenha) {
    throw new Error("E-mail, código e nova senha são obrigatórios");
  }

  console.log("📤 [REQ] POST /auth/redefinir-senha", {
    email,
    codigo,
  });

  const { data } = await api.post("/auth/redefinir-senha", {
    email,
    codigo,
    novaSenha,
  });

  console.log("✅ [RESP] /auth/redefinir-senha", data);
  return data;
}

/**
 * Wrapper compatível com a tela EsqueciSenhaCodigo:
 *   confirmarCodigoENovaSenha({ email, codigo, novaSenha })
 */
export async function confirmarCodigoENovaSenha(params) {
  return redefinirSenha(params);
}

/* ===== Reexports ===== */

export { getToken, getUserId, clearAuth };
