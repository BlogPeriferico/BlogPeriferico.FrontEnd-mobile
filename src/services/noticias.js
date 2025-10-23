import api from "./api";
import { getToken, getUserId } from "./auth";

/** LISTAGEM */
export async function getTodasNoticias() {
  const { data } = await api.get("/noticias");
  const arr = Array.isArray(data) ? data : [];
  const normalizadas = arr.map(mapNoticiaFromDTO);
  normalizadas.sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso));
  return normalizadas;
}

export function paginaNoticias(listaCompleta, { page = 1, pageSize = 5 } = {}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

function mapNoticiaFromDTO(n) {
  return {
    id: String(n.id),
    titulo: n.titulo ?? "",
    subtitulo: n.texto ?? "",
    imagem: n.imagem ?? "",
    thumb: n.imagem ?? "",
    regiao: n.zona ?? n.local ?? "Centro",
    dataIso: n.dataHoraCriacao ?? new Date().toISOString(),
    views: 0,
    comments: 0,
  };
}

/** CRIAÇÃO via fetch (FormData) — envia idUsuario numérico */
const BASE_URL = "https://backblog.azurewebsites.net";

export async function criarNoticia({ titulo, texto, local, zona, imagemFile, token }) {
  const [storedToken, storedUserId] = await Promise.all([getToken(), getUserId()]);
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
  const resp = await fetch(`${BASE_URL}/noticias`, { method: "POST", headers, body: form });

  if (!resp.ok) {
    const text = await safeReadText(resp);
    console.log("❌ (fetch) status:", resp.status, text);
    throw new Error(text || `HTTP ${resp.status}`);
  }

  const json = await safeReadJson(resp);
  return mapNoticiaFromDTO(json);
}

/** Helpers */
function guessNameAndType(file) {
  let name = file.fileName || filenameFromUri(file.uri) || "upload.jpg";
  let type = file.mimeType || mimeFromName(name) || "image/jpeg";
  return { name, type };
}
function filenameFromUri(uri = "") {
  try { const p = uri.split("?")[0]; return p.substring(p.lastIndexOf("/") + 1) || null; } catch { return null; }
}
function mimeFromName(name = "") {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return null;
}
async function safeReadText(resp) { try { return await resp.text(); } catch { return ""; } }
async function safeReadJson(resp) { try { return await resp.json(); } catch { return {}; } }
