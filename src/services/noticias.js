// src/services/noticias.js
import api from "./api";
import { getToken, getUserId } from "./auth";

const BASE_URL = "https://backbl0g.azurewebsites.net"; // mantém o que você já tinha

/** =========================
 *  LISTAGEM / PERFIL
 *  ========================= */
export async function getTodasNoticias() {
  try {
    const { data } = await api.get("/noticias");

    let listaBruta = [];

    // 1) Se o back já devolve array direto
    if (Array.isArray(data)) {
      listaBruta = data;
    }
    // 2) Se for página: { content: [...] }
    else if (data && Array.isArray(data.content)) {
      listaBruta = data.content;
    }
    // 3) Outras chaves (fallback)
    else if (data && Array.isArray(data.itens)) {
      listaBruta = data.itens;
    } else {
      console.log("⚠️ [noticias] formato inesperado em /noticias:", data);
      listaBruta = [];
    }

    const normalizadas = listaBruta.map(mapNoticiaFromDTO);

    // Mais recentes primeiro
    normalizadas.sort(
      (a, b) => new Date(b.dataIso).getTime() - new Date(a.dataIso).getTime()
    );

    console.log(
      "✅ [noticias] getTodasNoticias() ->",
      normalizadas.length,
      "itens"
    );

    return normalizadas;
  } catch (err) {
    console.log(
      "❌ [noticias] erro em getTodasNoticias:",
      err?.response?.data || err?.message || err
    );
    return [];
  }
}

export function paginaNoticias(
  listaCompleta,
  { page = 1, pageSize = 5 } = {}
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

/** =========================
 *  NORMALIZAÇÃO (IMPORTANTE
 *  pro Perfil detectar o dono)
 *  ========================= */
function mapNoticiaFromDTO(n = {}) {
  const id =
    n.id ??
    n.idNoticia ??
    n.id_noticia ??
    null;

  const usuarioRaw = n.usuario || n.autor || null;
  const idUsuario =
    n.idUsuario ??
    n.autorId ??
    (usuarioRaw && usuarioRaw.id != null ? usuarioRaw.id : null);

  const dataCriacao =
    n.dataHoraCriacao ??
    n.dataCriacao ??
    n.dataPublicacao ??
    n.dataIso ??
    null;

  const regiaoRaw =
    n.regiao ??
    n.zona ??
    n.local ??
    n.regiaoNoticia ??
    "Centro";

  return {
    // básicos
    id: id != null ? String(id) : "",
    titulo: n.titulo ?? "",
    subtitulo: n.subtitulo ?? n.texto ?? "",
    texto: n.texto ?? n.conteudo ?? "",
    imagem: n.imagem ?? n.thumb ?? "",
    thumb: n.thumb ?? n.imagem ?? "",

    // região + data
    regiao: regiaoRaw,
    dataIso: dataCriacao || new Date().toISOString(),

    // métricas opcionais
    views: n.views ?? n.visualizacoes ?? 0,
    comments: n.qtdComentarios ?? n.comments ?? 0,

    // 🔥 Campos de dono (ESSENCIAIS pro Perfil)
    idUsuario: idUsuario != null ? Number(idUsuario) : null,
    usuario: usuarioRaw || null,
    autor: usuarioRaw || null,
  };
}

/** =========================
 *  CRIAÇÃO DE NOTÍCIA (MOBILE)
 *  ========================= */
export async function criarNoticia({
  titulo,
  texto,
  local,
  zona,
  imagemFile,
  token,
}) {
  const [storedToken, storedUserId] = await Promise.all([
    getToken(),
    getUserId(),
  ]);
  const authToken = token || storedToken;
  const userId = storedUserId;

  if (!authToken) throw new Error("401 - Sem token. Faça login novamente.");
  if (!userId || Number.isNaN(Number(userId))) {
    throw new Error("400 - userId não encontrado (numérico). Faça login novamente.");
  }

  const form = new FormData();
  const dto = {
    titulo: (titulo || "").trim(),
    texto: (texto || "").trim(),
    local: (local || "").trim(),
    zona: (zona || "CENTRO").toUpperCase(),
    idUsuario: Number(userId),
  };
  form.append("dto", JSON.stringify(dto));

  if (imagemFile?.uri) {
    const { name, type } = guessNameAndType(imagemFile);
    form.append("file", { uri: imagemFile.uri, name, type });
  }

  const headers = { Authorization: `Bearer ${authToken}` };
  console.log("📤 [REQ] (fetch) POST /noticias");
  const resp = await fetch(`${BASE_URL}/noticias`, {
    method: "POST",
    headers,
    body: form,
  });

  if (!resp.ok) {
    const text = await safeReadText(resp);
    console.log("❌ (fetch/noticias) status:", resp.status, text);
    throw new Error(text || `HTTP ${resp.status}`);
  }

  const json = await safeReadJson(resp);
  return mapNoticiaFromDTO(json);
}

/* ===== Helpers de upload ===== */
function guessNameAndType(file) {
  let name = file.fileName || filenameFromUri(file.uri) || "upload.jpg";
  let type = file.mimeType || mimeFromName(name) || "image/jpeg";
  return { name, type };
}
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
async function safeReadText(resp) {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}
async function safeReadJson(resp) {
  try {
    return await resp.json();
  } catch {
    return {};
  }
}
