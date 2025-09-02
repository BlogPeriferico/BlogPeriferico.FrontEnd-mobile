import api from "./api";

// Cadastro direto no endpoint que existe no seu back
export async function cadastrarUsuario({ nome, email, senha }) {
  const body = { nome, email, senha };
  const { data } = await api.post("/usuarios/salvar", body, {
    headers: { Authorization: undefined, "Content-Type": "application/json" },
  });
  return data; // UsuarioDTO
}
