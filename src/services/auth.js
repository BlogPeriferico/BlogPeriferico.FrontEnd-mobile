import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** LOGIN */
export async function login({ email, senha }) {
  // rota real do seu back
  const { data } = await api.post(
    "/auth/login",
    { email, senha },
    { headers: { Authorization: undefined, "Content-Type": "application/json" } }
  );
  // o back retorna { token } (AuthResponse). Salva para próximas requests.
  const token = data?.token || data;
  if (token) {
    await AsyncStorage.setItem("@auth/token", token);
  }
  return data;
}

/** LOGOUT (opcional) */
export async function logout() {
  await AsyncStorage.removeItem("@auth/token");
}

/** Solicitar código de recuperação */
export async function solicitarCodigo({ email }) {
  const { data } = await api.post(
    "/auth/esqueci-senha",
    { email },
    { headers: { Authorization: undefined, "Content-Type": "application/json" } }
  );
  return data;
}

/** Confirmar código e trocar senha */
export async function confirmarCodigoENovaSenha({ email, codigo, novaSenha }) {
  const { data } = await api.post(
    "/auth/redefinir-senha",
    { email, codigo, novaSenha },
    { headers: { Authorization: undefined, "Content-Type": "application/json" } }
  );
  return data;
}
