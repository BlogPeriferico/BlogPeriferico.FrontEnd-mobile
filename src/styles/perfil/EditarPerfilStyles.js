import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.20)", // leve escurecida na imagem
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },

  // topo com seta + título
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginRight: 24, // compensa o espaço da seta
  },
  subtitulo: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },

  // card principal
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 200,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 20,
    paddingTop: 60, // espaço pro avatar
    paddingHorizontal: 18,
    paddingBottom: 22,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  // avatar circular que flutua
  avatarWrap: {
    position: "absolute",
    top: -50,
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  avatarFallbackText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#F9FAFB",
  },

  loadingArea: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // inputs
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
    color: "#111827",

    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.55)", // slate-400
  },
  inputBio: {
    minHeight: 80,
  },
  inputErro: {
    borderColor: "#DC2626",
  },

  botaoGradiente: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // link para redefinir senha
  senhaRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  senhaText: {
    fontSize: 13,
    color: "#D1D5DB",
  },
  senhaLink: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },
});
