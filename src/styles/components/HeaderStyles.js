// src/styles/components/HeaderStyles.js
import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // ===== Status bar / Safe Areas =====
  statusbarBackground: {
    backgroundColor: "#fff",
  },
  // spacer apenas para Android (StatusBar translúcida)
  statusBarSpacer: {
    height: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
    backgroundColor: "#fff",
  },
  // em iOS, um SafeAreaView vazio pinta o topo (notch) de branco
  safeAreaTopIOS: {
    backgroundColor: "#fff",
  },

  safeArea: {
    backgroundColor: "#fff",
    zIndex: 10,
  },

  // ===== Header (topo) =====
  headerContainer: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,

    // sombra leve em vez de borda
    shadowColor: "#fff",
    shadowOpacity: 0.0000005,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // === Hamburguer ===
  hamburguer: {
    width: 28,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  hBar: {
    position: "absolute",
    width: 22,
    height: 2.4,
    borderRadius: 2,
    backgroundColor: "#001C30",
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
    fontWeight: "bold",
    color: "#001C30",
  },

  // caixa da busca: linha + centralizado vertical
  searchBox: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    overflow: "hidden",
    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  // input ocupa a largura e alinha vertical
  inputBusca: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
    includeFontPadding: false,
    paddingRight: 8,
    textAlignVertical: "center",
  },

  // botão do X alinhado
  clearBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 6,
  },

  // ===== Drawer / Overlay =====
  fullscreenModal: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height,
    zIndex: 999,
    flexDirection: "row",
  },
  modalLateral: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: Math.min(0.78 * width, 320),
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 999,
  },
  modalItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001C30",
    paddingVertical: 14,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    borderBottomWidth: 0.5,
  },
  botaoFechar: {
    alignSelf: "flex-end",
    padding: 8,
  },

  /* ——— APENAS conteúdo do menu (drawer) abaixo ——— */
  drawerSectionTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 10,
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
    borderColor: "#E6EAF2",

    // “card” sutil
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  drawerRegionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    gap: 8,
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
    height: 12,
  },
});
