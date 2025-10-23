import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Card de fundo branco, sem borda aparente, sombra suave
  card: {
    borderRadius: 8,
    backgroundColor: "#FDFDFD",
    marginBottom: 12,

    // sombra leve (iOS/Android)
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // padding interno para a imagem ficar “solta” do contorno
  inner: {
    padding: 8,
  },

  // Imagem com cantos arredondados (dentro do card), quadrada
  cardImageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },

  // Texto
  cardBody: {
    paddingTop: 10,
    gap: 6,
  },

  // Título forte e maior (como no print)
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#0F172A",            // quase preto
    fontFamily: "Poppins-SemiBold",
  },

  // Metadados em cinza médio
  cardMeta: {
    fontSize: 12,
    lineHeight: 20,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },
});
