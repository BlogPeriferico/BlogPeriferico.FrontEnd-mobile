// src/utils/httpError.js
export function sliceStr(str = "", max = 600) {
  if (typeof str !== "string") return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

export function parseBodyMaybeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function humanizeHttpError(status, bodyText) {
  const body = parseBodyMaybeJson(bodyText);
  const msgFromBody =
    (body && (body.message || body.error || body.detail)) ||
    (typeof bodyText === "string" && bodyText.trim()) ||
    null;

  if (status === 0) return "Sem resposta do servidor. Verifique sua conexão.";
  if (status === 401) return "Sessão expirada ou inválida. Faça login novamente.";
  if (status === 403) return "Você não tem permissão para esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 413) return "Arquivo muito grande. Tente uma imagem menor.";
  if (status === 415) return "Formato de arquivo não suportado.";
  if (status === 422) return "Dados inválidos. Confira os campos e tente de novo.";
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";
  return msgFromBody || `Falha (${status}).`;
}

//  DIAGNÓSTICO DE ERROS 
export function formatAxiosError(err) {
  const r = err?.response;
  const status = r?.status ?? 0;
  const url = r?.config?.url || err?.config?.url || "";
  const method = (r?.config?.method || err?.config?.method || "GET").toUpperCase();

  const data = r?.data;
  const bodyText = typeof data === "string" ? data : JSON.stringify(data ?? {});
  const human = humanizeHttpError(status, bodyText);

  return {
    status,
    url,
    method,
    bodyText: sliceStr(bodyText),
    human,
    raw: err?.message || "",
    kind: r ? "response" : err?.request ? "no-response" : "setup",
  };
}

export async function formatFetchError(resp, fallbackText = "") {
  const status = resp?.status ?? 0;
  const url = resp?.url || "";
  const method = "POST"; 
  const human = humanizeHttpError(status, fallbackText);
  return {
    status,
    url,
    method,
    bodyText: sliceStr(fallbackText),
    human,
    kind: "response",
  };
}
