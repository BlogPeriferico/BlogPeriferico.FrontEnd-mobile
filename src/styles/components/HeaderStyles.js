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
    paddingBottom: 4,
  },

  // ===== Header (topo) =====
  headerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  // Barrinha colorida embaixo do header
  headerAccentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
    marginBottom: 8,
  },
  headerAccentBar: {
    width: "60%",
    height: 3,
    borderRadius: 999,
    backgroundColor: "#111827",
  },

  // === Hamburguer ===
  hamburguer: {
    width: 32,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  hBar: {
    position: "absolute",
    width: 22,
    height: 2.4,
    borderRadius: 999,
    backgroundColor: "#020617",
  },

  // === Centro (título/busca) ===
  centerArea: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#001C30",
    letterSpacing: 0.3,
  },

  searchBox: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 42,
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
    fontSize: 15,
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

  // ===== Drawer / Overlay =====
  fullscreenModal: {
    position: "absolute",
    // respeita a área da status bar
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
    padding: 8,
  },

  // Header do drawer (avatar + textos)
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

  // Itens do drawer
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

  // Título da seção "Localização"
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
