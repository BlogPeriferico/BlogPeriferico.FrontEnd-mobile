import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  /* ===== HEADER ESTILO INSTAGRAM ===== */
  headerCard: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginRight: 18,
    overflow: "hidden",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },

  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },

  statLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#4B5563",
  },

  nameBioBlock: {
    marginTop: 8,
  },

  userName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },

  userBio: {
    marginTop: 2,
    fontSize: 12,
    color: "#111827",
    lineHeight: 16,
    fontFamily: "Poppins-Regular",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  editProfileBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor: "#F9FAFB",
  },

  editProfileText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },

  roundIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },

  /* ===== ABAS ESTILO INSTAGRAM ===== */
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    marginTop: 6,
  },

  tabBtn: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  tabBtnActive: {
    borderBottomWidth: 2,
  },

  /* ===== LISTA / CARDS EM GRID ===== */
  cardsBlock: {
    marginTop: 6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cardGridItem: {
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    paddingVertical: 24,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },

  loadingWrap: {
    paddingVertical: 24,
    alignItems: "center",
  },
});
