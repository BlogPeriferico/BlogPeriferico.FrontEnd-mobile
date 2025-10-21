// src/utils/formatApiError.js
export function formatApiError(error, scope = "") {
  try {
    const status = error?.status ?? error?.response?.status;
    const code   = error?.code ?? error?.response?.data?.code;

    // 🔑 401 com escopo diferenciado
    if (status === 401) {
      if (scope === "login") return "Não foi possível entrar. E-mail ou senha inválidos.";
      return "Sessão inválida ou expirada. Faça o login novamente.";
    }

    if (code === "ECONNABORTED") return "A conexão demorou para responder. Tente novamente.";
    if (status === 403) return "Você não tem permissão para esta ação.";
    if (status === 404) return "Recurso não encontrado.";
    if (status >= 500) return "Erro no servidor. Tente novamente em instantes.";

    const apiMsg =
      error?.response?.data?.message ||
      error?.data?.message ||
      error?.message;
    return apiMsg || "Ocorreu um erro inesperado.";
  } catch {
    return "Ocorreu um erro inesperado.";
  }
}
