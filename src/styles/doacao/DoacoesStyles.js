import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // cinza claro para destacar o card
  },
  scroll: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },
  tituloSecao: {
    fontSize: 22,
    fontFamily: "Nunito-SemiBold",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderWidth: 1.5,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  // GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // CARD (igual ao print: arredondado, sombra leve, padding interno)
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,     // bem arredondado
    padding: 12,          // espaço interno (imagem + textos)
    marginBottom: 12,
    overflow: "visible",

    // sombra suave
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardImageWrap: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },

  // conteúdo textual
  cardBody: {
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Nunito-ExtraBold",
    color: "#0F172A", 
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    marginTop: 2,
  },

  // VER MAIS
  verMaisBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  verMaisLabel: {
    color: "#FFFFFF",
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
    textTransform: "uppercase",
  },
});
