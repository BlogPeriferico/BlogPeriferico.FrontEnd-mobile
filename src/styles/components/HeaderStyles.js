import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // ===== Status bar / Safe Areas =====
  statusbarBackground: {
    backgroundColor: "#fff",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    backgroundColor: "#fff",
  },
  safeAreaTopIOS: {
    backgroundColor: "#fff",
  },

  safeArea: {
    backgroundColor: "#fff",
    zIndex: 10,
    paddingBottom: 2,
  },

  // ===== Header (topo) =====
  headerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // ❗ sem borda marcada, sombra bem leve pra parecer contínuo
    borderBottomWidth: 0,
    borderBottomColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 0,
  },

  // Barrinha colorida embaixo do header
  headerAccentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
    marginBottom: 6,
  },
  headerAccentBar: {
    width: "52%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "#111827",
  },

  // === Hamburguer ===
  hamburguer: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  hBar: {
    position: "absolute",
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#0F172A",
  },

  // === Centro (título/busca) ===
  centerArea: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#0F172A",
    fontFamily: "Poppins-SemiBold",
  },

  searchBox: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    paddingHorizontal: 10,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  inputBusca: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 0,
    includeFontPadding: false,
    paddingRight: 8,
    textAlignVertical: "center",
  },

  clearBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 6,
  },

  // Ícone de busca à direita (pill)
  searchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // ===== Drawer / Overlay =====
  fullscreenModal: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
    left: 0,
    width: "100%",
    height:
      height - (Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0),
    zIndex: 999,
    flexDirection: "row",
  },

  modalLateral: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: Math.min(0.8 * width, 330),
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 18,

    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,

    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.40)",
    zIndex: 999,
  },

  botaoFechar: {
    alignSelf: "flex-end",
    padding: 4,
  },

  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  drawerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  drawerAvatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
  },
  drawerAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 999,
    marginRight: 12,
  },
  drawerHeaderTextWrap: {
    flex: 1,
  },
  drawerHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  drawerHeaderSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  drawerItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "rgba(15, 23, 42, 0.04)",
    borderBottomWidth: 0.7,
  },
  drawerItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  drawerItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  drawerSectionTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 14,
    marginBottom: 8,
  },

  drawerRegionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  drawerRegionLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  drawerRegionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F1F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerRegionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  drawerRegionRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  drawerRegionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  drawerRegionChipText: {
    color: "#3949AB",
    fontSize: 12,
    fontWeight: "700",
  },

  drawerChevron: {
    marginLeft: 4,
  },

  drawerDivider: {
    height: 16,
  },
});
