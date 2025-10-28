import api from "./api";
import { getUsuarioById } from "./usuario";

const DEBUG_COM = true;

const userCache = new Map(); 

async function getUserCached(userId) {
  if (!userId) return null;
  if (userCache.has(userId)) {
    if (DEBUG_COM) console.log("📦[comentarios] cache HIT para userId:", userId);
    return userCache.get(userId);
  }
  if (DEBUG_COM) console.log("🔎[comentarios] cache MISS → getUsuarioById:", userId);
  try {
    const u = await getUsuarioById(Number(userId));
    userCache.set(userId, u || null);
    return u || null;
  } catch (e) {
    if (DEBUG_COM) console.log("[comentarios] erro ao buscar user:", userId, e?.message);
    userCache.set(userId, null);
    return null;
  }
}

/* Enriquecimento: injeta nomeUsuario/fotoUsuario quando faltar */
export async function enrichComentariosWithUsers(lista = []) {
  const out = Array.isArray(lista) ? [...lista] : [];
  const needUserIds = new Set();

  for (const c of out) {
    const idUsuario =
      c?.idUsuario ??
      c?.usuarioId ??
      c?.userId ??
      (typeof c?.usuario === "object" ? c.usuario?.id : null);

    // anota o id no próprio comentário pra facilitar downstream
    if (idUsuario != null && c.idUsuario == null) {
      c.idUsuario = Number(idUsuario);
    }

    const hasFoto = !!c?.fotoUsuario;
    const hasNome = !!c?.nomeUsuario;

    if (!hasFoto || !hasNome) {
      if (idUsuario != null) needUserIds.add(Number(idUsuario));
    }
  }

  if (DEBUG_COM) console.log("[comentarios] ids p/ enriquecer:", Array.from(needUserIds));

  const idArr = Array.from(needUserIds);
  const users = await Promise.all(idArr.map((id) => getUserCached(id)));
  const userMap = new Map();
  idArr.forEach((id, i) => userMap.set(id, users[i]));

  for (const c of out) {
    const uid = Number(
      c?.idUsuario ?? c?.usuarioId ?? c?.userId ?? (typeof c?.usuario === "object" ? c.usuario?.id : NaN)
    );
    const u = userMap.get(uid);

    if (!c.nomeUsuario && u?.nome) c.nomeUsuario = u.nome;
    if (!c.fotoUsuario && u?.foto) c.fotoUsuario = u.foto;

    if (DEBUG_COM) {
      console.log("🧩[comentarios] item enrich:", {
        id: c?.id,
        idUsuario: uid,
        nomeUsuario: c?.nomeUsuario,
        fotoUsuario: c?.fotoUsuario,
      });
    }
  }

  return out;
}

//  VENDAS 
export async function listComentariosVenda(vendaId) {
  if (DEBUG_COM) console.log("📤 [REQ] GET /comentarios/venda/", vendaId);
  const { data } = await api.get(`/comentarios/venda/${vendaId}`);
  const arr = Array.isArray(data) ? data : [];
  if (DEBUG_COM) console.log("✅ [RESP] /comentarios/venda ->", arr.length);

  // enriquecer antes de retornar
  const enriched = await enrichComentariosWithUsers(arr);
  if (DEBUG_COM) console.log("🎯 [ENRICH] comentarios/venda ->", enriched.length);
  return enriched;
}

export async function criarComentarioVenda({ texto, idVenda, idUsuario, token }) {
  const payload = { texto, idVenda, idUsuario };
  if (DEBUG_COM) console.log("📤 [REQ] POST /comentarios (venda)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (DEBUG_COM) console.log("✅ [RESP] POST /comentarios (venda) ->", data?.id ?? data);

  // Tenta enriquecer o recém criado também
  try {
    const u = await getUserCached(Number(idUsuario));
    if (u) {
      data.nomeUsuario = data?.nomeUsuario || u.nome;
      data.fotoUsuario = data?.fotoUsuario || u.foto;
    }
  } catch {}
  return data;
}

//  NOTÍCIAS 
export async function listComentariosNoticia(noticiaId) {
  if (DEBUG_COM) console.log(" [REQ] GET /comentarios/noticia/", noticiaId);
  const { data } = await api.get(`/comentarios/noticia/${noticiaId}`);
  const arr = Array.isArray(data) ? data : [];
  if (DEBUG_COM) console.log(" [RESP] /comentarios/noticia ->", arr.length);
  const enriched = await enrichComentariosWithUsers(arr);
  if (DEBUG_COM) console.log(" [ENRICH] comentarios/noticia ->", enriched.length);
  return enriched;
}

export async function criarComentarioNoticia({ texto, idNoticia, idUsuario, token }) {
  const payload = { texto, idNoticia, idUsuario };
  if (DEBUG_COM) console.log(" [REQ] POST /comentarios (noticia)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (DEBUG_COM) console.log(" [RESP] POST /comentarios (noticia) ->", data?.id ?? data);
  try {
    const u = await getUserCached(Number(idUsuario));
    if (u) { data.nomeUsuario = data?.nomeUsuario || u.nome; data.fotoUsuario = data?.fotoUsuario || u.foto; }
  } catch {}
  return data;
}

//  DOAÇÕES 
export async function listComentariosDoacao(doacaoId) {
  if (DEBUG_COM) console.log(" [REQ] GET /comentarios/doacao/", doacaoId);
  const { data } = await api.get(`/comentarios/doacao/${doacaoId}`);
  const arr = Array.isArray(data) ? data : [];
  if (DEBUG_COM) console.log(" [RESP] /comentarios/doacao ->", arr.length);
  const enriched = await enrichComentariosWithUsers(arr);
  if (DEBUG_COM) console.log(" [ENRICH] comentarios/doacao ->", enriched.length);
  return enriched;
}

export async function criarComentarioDoacao({ texto, idDoacao, idUsuario, token }) {
  const payload = { texto, idDoacao, idUsuario };
  if (DEBUG_COM) console.log(" [REQ] POST /comentarios (doacao)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (DEBUG_COM) console.log(" [RESP] POST /comentarios (doacao) ->", data?.id ?? data);
  try {
    const u = await getUserCached(Number(idUsuario));
    if (u) { data.nomeUsuario = data?.nomeUsuario || u.nome; data.fotoUsuario = data?.fotoUsuario || u.foto; }
  } catch {}
  return data;
}
