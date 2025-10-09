import api from "./api";
import { getToken, getUserId } from "./auth";

/**
 * 📦 Obtém todas as doações do backend.
 */
export async function getTodasDoacoes() {
  const { data } = await api.get("/doacoes");
  const arr = Array.isArray(data) ? data : [];
  return arr.map(mapDoacaoFromDTO);
}

/**
 * 🔢 Paginação simples no front (client-side)
 */
export function paginaDoacoes(listaCompleta, { page = 1, pageSize = 5 } = {}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = listaCompleta.slice(start, end);
  return { items, hasMore: end < listaCompleta.length };
}

/**
 * 🧾 Cria uma nova doação
 * Envia dados e imagem (se houver) via FormData.
 */
export async function criarDoacao({ titulo, descricao, telefone, zona, imagemFile, token }) {
  // Recupera token e id do usuário
  const [authToken, userId] = await Promise.all([token || getToken(), getUserId()]);

  if (!authToken) throw new Error("401 - Sem token. Faça login novamente.");
  if (!userId) throw new Error("400 - Usuário não identificado.");

  // Cria DTO para o backend
  const dto = JSON.stringify({
    titulo: (titulo || "").trim(),
    descricao: (descricao || "").trim(),
    telefone: (telefone || "").trim(),
    zona: (zona || "CENTRO").toUpperCase(),
    idUsuario: Number(userId),
  });

  const formData = new FormData();
  formData.append("dto", dto);

  // Se houver imagem, adiciona ao FormData
  if (imagemFile?.uri) {
    formData.append("file", {
      uri: imagemFile.uri,
      name: imagemFile.fileName || "doacao.jpg",
      type: imagemFile.mimeType || "image/jpeg",
    });
  }

  // 🔑 IMPORTANTE: não setar Content-Type manual no mobile
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  console.log("📤 [REQ] POST /doacoes", dto, imagemFile?.uri);
  const { data } = await api.post("/doacoes", formData, { headers });

  return mapDoacaoFromDTO(data);
}

/**
 * 🔁 Mapeia DTO do backend para o formato usado no app.
 */
function mapDoacaoFromDTO(d) {
  return {
    id: String(d.id),
    titulo: d.titulo ?? "",
    descricao: d.descricao ?? "",
    telefone: d.telefone ?? "",
    imagem: d.imagem ?? "",
    zona: d.zona ?? "",
    dataHoraCriacao: d.dataHoraCriacao ?? "",
  };
}
