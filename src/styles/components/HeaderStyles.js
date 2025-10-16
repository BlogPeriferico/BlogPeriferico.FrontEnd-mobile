import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
  searchBox: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    overflow: "hidden",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputBusca: {
    height: 40,
    fontSize: 16,
    color: "#000",
  },

  // === Drawer / Overlay ===
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
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
  },
  botaoFechar: {
    alignSelf: "flex-end",
    padding: 8,
  },
});