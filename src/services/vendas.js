// src/services/vendas.js
import { Platform } from "react-native";
import api from "./api";
import { getToken, getUserId } from "./auth"; // se preferir, pegue de tokenStore + getUserId

const BASE_URL = "https://backblog.azurewebsites.net";

/* LISTAGEM / PAGINAÇÃO */
export async function getTodasVendas() {
  const { data } = await api.get("/vendas");
  const arr = Array.isArray(data) ? data : [];
  return arr.map(mapVendaFromDTO);
}

export function paginaVendas(listaCompleta, { page = 1, pageSize = 6 } = {}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

/** =========================
 *  CRIAÇÃO (via fetch)
 *  Back: @RequestParam("dto") + @RequestPart("file") opcional
 *  Requer Bearer e idUsuario no DTO
 *  ========================= */
export async function criarVenda({
  titulo,
  descricao,
  telefone,
  cpf,
  zona,
  valor,          
  imagemFile,     
  token,
}) {
  const authToken = token || (await getToken());
  if (!authToken) throw new Error("401 - Sem token. Faça login novamente.");

  const idUsuario = await getUserId();
  if (!idUsuario) throw new Error("Usuário não identificado. Faça login novamente.");

  const onlyDigits = (x = "") => String(x).replace(/\D/g, "");

  const dto = {
    idUsuario: Number(idUsuario),
    titulo: (titulo || "").trim(),
    descricao: (descricao || "").trim(),
    telefone: onlyDigits(telefone || ""),
    cpf: onlyDigits(cpf || ""),
    zona: (zona || "CENTRO").toUpperCase(),
    valor: valor != null && valor !== "" ? Number(String(valor).replace(",", ".")) : null,
  };

  const form = new FormData();
  form.append("dto", JSON.stringify(dto));

  if (imagemFile?.uri) {
    const uri = Platform.OS === "ios" ? imagemFile.uri.replace("file://", "") : imagemFile.uri;
    let name = imagemFile.fileName || filenameFromUri(uri) || `venda_${Date.now()}`;
    if (!/\.(png|jpe?g|webp)$/i.test(name)) name += ".jpg";
    const type = imagemFile.mimeType || mimeFromName(name) || "image/jpeg";
    form.append("file", { uri, name, type });
  }

  let resp;
  try {
    resp = await fetch(`${BASE_URL}/vendas`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: form,
    });
  } catch (e) {
    throw new Error("Sem resposta do servidor. Verifique sua conexão.");
  }

  const text = await safeReadText(resp);
  if (!resp.ok) {
    throw new Error(humanizeHttpError(resp.status, text));
  }

  try {
    return mapVendaFromDTO(JSON.parse(text));
  } catch {
    return mapVendaFromDTO({});
  }
}

/* Helpers de mapeamento  */
export function mapVendaFromDTO(d = {}) {
  return {
    id: d?.id != null ? String(d.id) : "",
    titulo: d?.titulo ?? "",
    descricao: d?.descricao ?? "",
    imagem: d?.imagem ?? "",
    telefone: d?.telefone ?? "",
    cpf: d?.cpf ?? "",
    valor: d?.valor ?? null, 
    zona: d?.zona ?? "",
    dataHoraCriacao: d?.dataHoraCriacao ?? "",
    idUsuario: d?.idUsuario ?? null,
  };
}

/* Utils */
function filenameFromUri(uri = "") {
  try {
    const p = uri.split("?")[0];
    return p.substring(p.lastIndexOf("/") + 1) || null;
  } catch {
    return null;
  }
}
function mimeFromName(name = "") {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return null;
}
function parseBodyMaybeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}
function humanizeHttpError(status, bodyText = "") {
  const body = parseBodyMaybeJson(bodyText);
  const msg = (body?.message || body?.error || body?.detail || "").trim();
  if (status === 0) return "Sem resposta do servidor. Verifique sua conexão.";
  if (status === 400) return msg || "Requisição inválida.";
  if (status === 401) return "Sessão expirada ou inválida. Faça login novamente.";
  if (status === 403) return "Você não tem permissão para esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 413) return "Arquivo muito grande. Tente uma imagem menor.";
  if (status === 415) return "Formato de arquivo não suportado.";
  if (status === 422) return "Dados inválidos. Confira os campos e tente de novo.";
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";
  return msg || `Falha (${status}).`;
}
async function safeReadText(resp) {
  try { return await resp.text(); } catch { return ""; }
}
