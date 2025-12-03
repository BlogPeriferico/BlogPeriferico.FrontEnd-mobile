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
    backgroundColor: "rgba(15,23,42,0.45)", // escurece de leve e puxa pro azul
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
    columnGap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerTextWrap: {
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    letterSpacing: 0.3,
  },
  subtitulo: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(209,213,219,0.95)",
  },

  // card principal
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 60,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(248,250,252,0.96)", // quase branco com glass
    borderRadius: 24,
    paddingTop: 56, // espaço pro avatar
    paddingHorizontal: 18,
    paddingBottom: 22,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    alignSelf: "flex-start",
    marginBottom: 14,
  },

  // avatar circular que flutua
  avatarWrap: {
    position: "absolute",
    top: -42,
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    borderWidth: 3,
    borderColor: "#F9FAFB",
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
    fontSize: 30,
    fontWeight: "700",
    color: "#F9FAFB",
  },

  loadingArea: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // grupo de input (ícone + campo)
  inputWrapper: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)", // slate
    backgroundColor: "rgba(255,255,255,0.96)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  inputWrapperErro: {
    borderColor: "#DC2626",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
  },

  inputBioWrapper: {
    alignItems: "flex-start",
  },
  inputBio: {
    minHeight: 80,
    maxHeight: 120,
  },

  botaoGradiente: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  // link para redefinir senha
  senhaRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  senhaText: {
    fontSize: 13,
    color: "#3c3c3c",
  },
  senhaLink: {
    fontSize: 13,
    color: "#F97316",
    fontWeight: "600",
  },
});
