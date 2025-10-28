// src/services/usuario.js
import api, { getBaseURL } from "./api";

const DEBUG_USER = true;

function ensureAbsoluteUrl(u) {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u; // já é absoluta
  const base = getBaseURL();
  const path = String(u).replace(/^\//, "");
  const abs = base && path ? `${base}/${path}` : "";
  if (DEBUG_USER) console.log("🧩[usuario.ensureAbsoluteUrl]", { raw: u, base, abs });
  return abs;
}

/** Normaliza a estrutura do usuário vinda do back */
function mapUsuario(d = {}) {
  const fotoRaw =
    d?.fotoPerfil ||        // seu back
    d?.foto ||
    d?.imagem ||
    d?.imagemPerfil ||
    d?.avatarUrl ||
    d?.profileImageUrl ||
    "";

  const user = {
    id: d?.id ?? d?.id_usuario ?? null,
    nome: d?.nome || d?.username || d?.apelido || d?.email || "Usuário",
    email: d?.email || "",
    foto: ensureAbsoluteUrl(fotoRaw),
  };

  if (DEBUG_USER) {
    console.log("🧾[usuario.mapUsuario] in:", d);
    console.log("🧾[usuario.mapUsuario] out:", user);
    if (!fotoRaw) console.log("⚠️[usuario.mapUsuario] fotoPerfil vazio no backend payload");
  }
  return user;
}

/**
 * Busca um usuário por ID
 * Controller: GET /usuarios/listar/{id}
 */
export async function getUsuarioById(id) {
  if (id == null) return null;
  if (DEBUG_USER) console.log("📤[usuario.getUsuarioById] GET /usuarios/listar/", id);
  const { data } = await api.get(`/usuarios/listar/${id}`);
  if (DEBUG_USER) console.log("✅[usuario.getUsuarioById] resp:", data);
  const mapped = mapUsuario(data || {});
  if (DEBUG_USER) console.log("🎯[usuario.getUsuarioById] mapped:", mapped);
  return mapped;
}

/** Cadastra um novo usuário */
export async function cadastrarUsuario({ nome, email, senha }) {
  if (DEBUG_USER) console.log("📤[usuario.cadastrar] POST /usuarios/salvar", { nome, email, senha: "***" });
  const { data } = await api.post("/usuarios/salvar", { nome, email, senha });
  if (DEBUG_USER) console.log("✅[usuario.cadastrar] resp:", data);
  return data;
}

/**
 * Busca o id do usuário pelo email usando /usuarios/listar
 * Retorna Number(id) ou null se não achar.
 */
export async function getUserIdByEmail(email) {
  if (!email) return null;
  if (DEBUG_USER) console.log("📤[usuario.getUserIdByEmail] GET /usuarios/listar (find by email)", email);
  const { data } = await api.get("/usuarios/listar");
  const arr = Array.isArray(data) ? data : [];
  const found = arr.find(
    (u) => String(u?.email || "").toLowerCase() === String(email).toLowerCase()
  );
  const id = found?.id ?? found?.id_usuario ?? null;
  const num = id != null && !Number.isNaN(Number(id)) ? Number(id) : null;
  if (DEBUG_USER) console.log("🎯[usuario.getUserIdByEmail] found:", { id: num, nome: found?.nome, fotoPerfil: found?.fotoPerfil });
  return num;
}

// exporta o mapper se precisar
export const usuarioUtils = { mapUsuario, ensureAbsoluteUrl };
