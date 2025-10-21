// src/services/comentarios.js
import api from "./api";

// Debug de carregamento do módulo
console.log("🔧 [comentarios.js] módulo carregado");

// ------------- Notícias -------------
export async function listComentariosNoticia(noticiaId) {
  console.log("📤 [REQ] GET /comentarios/noticia/", noticiaId);
  const { data } = await api.get(`/comentarios/noticia/${noticiaId}`);
  console.log("✅ [RESP] /comentarios/noticia ->", Array.isArray(data) ? data.length : data);
  return Array.isArray(data) ? data : [];
}

export async function criarComentarioNoticia({ texto, idNoticia, idUsuario, token }) {
  const payload = { texto, idNoticia, idUsuario };
  console.log("📤 [REQ] POST /comentarios (noticia)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ [RESP] POST /comentarios (noticia) ->", data?.id ?? data);
  return data;
}

// ------------- Doações -------------
export async function listComentariosDoacao(doacaoId) {
  console.log("📤 [REQ] GET /comentarios/doacao/", doacaoId);
  const { data } = await api.get(`/comentarios/doacao/${doacaoId}`);
  console.log("✅ [RESP] /comentarios/doacao ->", Array.isArray(data) ? data.length : data);
  return Array.isArray(data) ? data : [];
}

export async function criarComentarioDoacao({ texto, idDoacao, idUsuario, token }) {
  const payload = { texto, idDoacao, idUsuario };
  console.log("📤 [REQ] POST /comentarios (doacao)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ [RESP] POST /comentarios (doacao) ->", data?.id ?? data);
  return data;
}

// ------------- Vagas -------------
export async function listComentariosVaga(vagaId) {
  console.log("📤 [REQ] GET /comentarios/vaga/", vagaId);
  const { data } = await api.get(`/comentarios/vaga/${vagaId}`);
  console.log("✅ [RESP] /comentarios/vaga ->", Array.isArray(data) ? data.length : data);
  return Array.isArray(data) ? data : [];
}

export async function criarComentarioVaga({ texto, idVaga, idUsuario, token }) {
  const payload = { texto, idVaga, idUsuario };
  console.log("📤 [REQ] POST /comentarios (vaga)", payload);
  const { data } = await api.post(`/comentarios`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ [RESP] POST /comentarios (vaga) ->", data?.id ?? data);
  return data;
}
