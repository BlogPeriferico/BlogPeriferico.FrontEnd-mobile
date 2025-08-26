import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    height: 240, // menor altura
    overflow: "hidden",
    marginTop: 6,
    position: "relative",
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  // topo
  localTop: {
    position: "absolute",
    top: 8,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  localizacao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14, // menor
  },

  // conteúdo central
  centerContent: {
    position: "absolute",
    alignSelf: "center",
    top: "40%", // centraliza verticalmente
    alignItems: "center",
  },
  icone: {
    width: 40,
    height: 40, // ícone menor
    marginBottom: 2,
  },
  temp: {
    fontSize: 26, // temperatura menor
    color: "#fff",
    fontWeight: "700",
  },
  weekday: {
    color: "#EAF0F6",
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    color: "#EAF0F6",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
  },
  erro: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
    color: "red",
    fontWeight: "600",
  },

  // setas
  navBtn: {
    position: "absolute",
    top: "45%",
    width: 28,
    height: 28,
    color: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  esquerda: { left: 6 },
  direita: { right: 6 },
});
