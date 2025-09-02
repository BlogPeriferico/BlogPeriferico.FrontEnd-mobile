export function formatApiError(error, context = "default") {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const raw =
    typeof data === "string" ? data : data?.message || data?.error || error?.message || "Ocorreu um erro.";

  if (context === "login") {
    if (status === 401) return "E-mail ou senha incorretos.";
    if (status === 500) return "Erro interno no servidor. Tente mais tarde.";
    return raw;
  }

  if (context === "cadastro") {
    if (status === 409 || (status === 400 && /email/i.test(String(raw))))
      return "Este e-mail já está cadastrado. Tente outro.";
    if (status === 500) return "Erro interno no servidor. Tente novamente mais tarde.";
    return raw;
  }

  if (context === "recovery-send") {
    if (status === 404) return "E-mail não encontrado.";
    if (status === 500) return "Erro ao enviar o código. Tente novamente mais tarde.";
    return raw;
  }

  if (context === "recovery-confirm") {
    if (status === 400) return "Código inválido ou expirado.";
    return raw;
  }

  return raw;
}
