import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  headerTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 78 : 68,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },

  // Wrapper do card: sombra apenas no iOS (no Android 0 para não criar halo)
  cardWrapper: {
    width: "90%",
    maxWidth: 370,
    borderRadius: 20,
    marginTop: 271,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 18,
      },
      android: {
        elevation: 0, // << zera sombra no Android para remover a borda interna
      },
    }),
  },

  // Card sem sombra/borda; translúcido
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    overflow: "hidden",
  },

  // Inputs SEM sombras no Android (para não formar halo nas bordas)
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.98)",
    color: "#111",
    borderWidth: 0,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
      android: { elevation: 0 }, // <<
    }),
  },
  inputErro: {
    borderWidth: 1.5,
    borderColor: "#D93025",
  },

  senhaContainer: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.98)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
      android: { elevation: 0 }, // <<
    }),
  },
  inputSenha: {
    flex: 1,
    color: "#111",
    paddingRight: 10,
  },

  linhaLembrete: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkboxBase: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9AA3AF",
    backgroundColor: "transparent",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxMarcado: { backgroundColor: "#3A74FF", borderColor: "#3A74FF" },
  checkboxIcon: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 12,
    textAlign: "center",
    fontWeight: "700",
  },
  checkboxTexto: { color: "#9AA3AF", fontSize: 14 },
  link: { color: "#3A74FF", fontSize: 13 },

  // Botão Login: sem sombra no Android
  botaoGradiente: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10 },
      android: { elevation: 0 }, // <<
    }),
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Divider OU
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  dividerText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 10,
  },

  // Visitante: sem sombra no Android (tem só a borda branca)
  visitorButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
  },
  visitorText: { color: "#F1F5F9", fontSize: 15, fontWeight: "600" },

  registroContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  registroTexto: { color: "#6C7278", fontSize: 14 },
  linkRegistro: { color: "#3A74FF", fontSize: 14, fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 22,
    width: "100%",
    textAlign: "center",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
