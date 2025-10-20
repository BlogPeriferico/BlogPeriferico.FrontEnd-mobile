import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Card de fundo branco, sem borda aparente, sombra suave
  card: {
    borderRadius: 8,
    backgroundColor: "#FDFDFD",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // padding interno para a imagem ficar “solta”
  inner: {
    padding: 8,
  },

  // Imagem quadrada com cantos arredondados
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

  // Título forte
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#0F172A",
    fontFamily: "Poppins-SemiBold",
  },

  // Metadados
  cardMeta: {
    fontSize: 12,
    lineHeight: 20,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },
});
