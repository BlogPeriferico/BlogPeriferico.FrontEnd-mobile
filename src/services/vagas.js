import { Platform } from "react-native";
import api from "./api";
import { getToken } from "./auth";

const BASE_URL = "https://backblog.azurewebsites.net";


export async function getTodasVagas() {
  const { data } = await api.get("/vagas");
  const arr = Array.isArray(data) ? data : [];
  return arr.map(mapVagaFromDTO);
}

export function paginaVagas(listaCompleta, { page = 1, pageSize = 6 } = {}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

/** =========================
 *  CRIAÇÃO (via fetch)
 *  Alinhado ao controller:
 *   - @RequestParam("dto") String dtoJson
 *   - @RequestPart("file") MultipartFile file (opcional)
 *   - Auth: Bearer (roles USUARIO/ADMINISTRADOR)
 *  ========================= */
export async function criarVaga({
  titulo,
  descricao,
  telefone,
  zona,
  imagemFile,
  token,
}) {
  const authToken = token || (await getToken());
  if (!authToken) throw new Error("401 - Sem token. Faça login novamente.");

  const soDigitos = (x = "") => String(x).replace(/\D/g, "");

  const dto = {
    titulo: (titulo || "").trim(),
    descricao: (descricao || "").trim(),
    telefone: soDigitos(telefone || ""), 
    zona: (zona || "CENTRO").toUpperCase(),
  };

  const form = new FormData();
  form.append("dto", JSON.stringify(dto)); 

  if (imagemFile?.uri) {
    const uri =
      Platform.OS === "ios" ? imagemFile.uri.replace("file://", "") : imagemFile.uri;

    const name =
      imagemFile.fileName ||
      filenameFromUri(uri) ||
      `vaga_${Date.now()}.${(uri.split(".").pop() || "jpg")}`;

    const type = imagemFile.mimeType || mimeFromName(name) || "image/jpeg";

    form.append("file", { uri, name, type }); 
  }

  console.log("📤 [REQ] (fetch) POST /vagas");
  logFormData(form); 

  let resp;
  try {
    resp = await fetch(`${BASE_URL}/vagas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`, 
      },
      body: form,
    });
  } catch (netErr) {
    const diag = {
      status: 0,
      url: `${BASE_URL}/vagas`,
      method: "POST",
      bodyText: "",
      human: "Sem resposta do servidor. Verifique sua conexão.",
      kind: "no-response",
      raw: String(netErr?.message || netErr),
    };
    console.log(" DIAG (fetch/vagas):", diag);
    throw new Error(diag.human);
  }

  const text = await safeReadText(resp);

  if (!resp.ok) {
    const diag = formatFetchError(resp, text);
    console.log(" DIAG (fetch/vagas):", diag);
    throw new Error(diag.human);
  }

  try {
    return mapVagaFromDTO(JSON.parse(text));
  } catch {
    return mapVagaFromDTO({});
  }
}


function mapVagaFromDTO(d = {}) {
  return {
    id: d?.id != null ? String(d.id) : "",
    titulo: d?.titulo ?? "",
    descricao: d?.descricao ?? "",
    telefone: d?.telefone ?? "",
    imagem: d?.imagem ?? "",
    zona: d?.zona ?? "",
    dataHoraCriacao: d?.dataHoraCriacao ?? "",
    idUsuario: d?.idUsuario ?? null,
  };
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
function sliceStr(str = "", max = 600) {
  if (typeof str !== "string") return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
function parseBodyMaybeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
function humanizeHttpError(status, bodyText) {
  const body = parseBodyMaybeJson(bodyText);
  const msgFromBody =
    (body && (body.message || body.error || body.detail)) ||
    (typeof bodyText === "string" && bodyText.trim()) ||
    null;

  if (status === 0) return "Sem resposta do servidor. Verifique sua conexão.";
  if (status === 400) return msgFromBody || "Requisição inválida.";
  if (status === 401) return "Sessão expirada ou inválida. Faça login novamente.";
  if (status === 403) return "Você não tem permissão para esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 413) return "Arquivo muito grande. Tente uma imagem menor.";
  if (status === 415) return "Formato de arquivo não suportado.";
  if (status === 422) return "Dados inválidos. Confira os campos e tente de novo.";
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";
  return msgFromBody || `Falha (${status}).`;
}
function formatFetchError(resp, bodyText = "") {
  const status = resp?.status ?? 0;
  const url = resp?.url || `${BASE_URL}/vagas`;
  const method = "POST";
  return {
    status,
    url,
    method,
    bodyText: sliceStr(bodyText),
    human: humanizeHttpError(status, bodyText),
    kind: "response",
  };
}
async function safeReadText(resp) {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}

function logFormData(fd) {
  try {
    const parts = fd?._parts || [];
    const pretty = parts.map(([k, v]) => {
      if (typeof v === "string") {
        const safe = v.length > 120 ? v.slice(0, 120) + "…" : v;
        return `${k}: (string:${safe.length}) ${safe}`;
      } else if (v && typeof v === "object") {
        return `${k}: { uri: ${v.uri}, name: ${v.name}, type: ${v.type} }`;
      }
      return `${k}: (${typeof v})`;
    });
    console.log("🧾 FormData parts:\n - " + pretty.join("\n - "));
  } catch (e) {
    console.log("🧾 FormData (não foi possível debugar):", e?.message || e);
  }
}
