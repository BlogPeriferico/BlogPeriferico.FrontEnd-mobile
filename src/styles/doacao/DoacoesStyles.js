import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    paddingBottom: 24,
    paddingTop: 8,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
