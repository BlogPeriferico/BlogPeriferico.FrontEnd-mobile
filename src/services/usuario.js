import api from "./api";

/**
 * Cadastra um novo usuário
 */
export async function cadastrarUsuario({ nome, email, senha }) {
  const { data } = await api.post("/usuarios/salvar", {
    nome,
    email,
    senha,
  });
  return data;
}

/**
 * Busca o id do usuário pelo email usando /usuarios/listar
 * Retorna Number(id) ou null se não achar.
 */
export async function getUserIdByEmail(email) {
  if (!email) return null;
  const { data } = await api.get("/usuarios/listar");
  const arr = Array.isArray(data) ? data : [];
  // compara email case-insensitive
  const found = arr.find((u) => String(u?.email || "").toLowerCase() === String(email).toLowerCase());
  const id = found?.id ?? found?.id_usuario ?? null;
  return id != null && !Number.isNaN(Number(id)) ? Number(id) : null;
}
