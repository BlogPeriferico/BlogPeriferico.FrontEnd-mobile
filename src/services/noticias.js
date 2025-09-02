import api from "./api"; // usa o interceptor de token

/**
 * Busca todas as notícias do backend:
 * GET /noticias -> lista de NoticiaDTO
 */
export async function getTodasNoticias() {
  const { data } = await api.get("/noticias");
  const arr = Array.isArray(data) ? data : [];

  const normalizadas = arr.map(mapNoticiaFromDTO);

  // Ordena por data (mais recentes primeiro)
  normalizadas.sort((a, b) => {
    const ta = new Date(a.dataIso).getTime();
    const tb = new Date(b.dataIso).getTime();
    return tb - ta;
  });

  return normalizadas;
}

/** Fatia a lista completa para paginação no cliente */
export function paginaNoticias(listaCompleta, { page = 1, pageSize = 5 } = {}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

/** Normaliza NoticiaDTO => objeto usado no app */
function mapNoticiaFromDTO(n) {
  // seus campos: id, local, titulo, texto, imagem, zona, dataHoraCriacao, idUsuario
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
