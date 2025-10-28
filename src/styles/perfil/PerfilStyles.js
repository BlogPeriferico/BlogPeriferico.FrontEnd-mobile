import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 90,
  },

  // Header
  headerCard: {
    backgroundColor: "#FFF7F0",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginRight: 10,
    overflow: "hidden",
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  headerInfo: { flex: 1, paddingRight: 6 },
  userName: { fontSize: 16, fontFamily: "Poppins-SemiBold" },
  userBio: { marginTop: 4, fontSize: 12, color: "#6B7280", lineHeight: 16, fontFamily: "Poppins-Regular" },
  editBtn: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 1,
    alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", marginLeft: 8,
  },

  // Abas
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
    marginBottom: 8,
  },
  tabBtn: {
    height: 36,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "transparent",
  },

  // Lista/cards
  cardsBlock: { marginTop: 4 },

  // ⬇️ Grid 2 colunas (igual outras telas)
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  cardSpacer: { marginBottom: 10 },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    paddingVertical: 24,
    fontFamily: "Poppins-Regular",
  },
});
