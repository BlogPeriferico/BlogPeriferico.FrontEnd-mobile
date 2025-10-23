import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollBody: {
    paddingBottom: 40,
  },

  // CAPA
  headerImageWrap: {
    width: "100%",
    height: 390,
    backgroundColor: "#E5E7EB",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },

  // Pegador solto
  handleWrap: {
    marginTop: -8,
    alignItems: "center",
    marginBottom: 12,
  },
  handle: {
    width: 50,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },

  // Conteúdo
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Breadcrumb
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: "Poppins-Regular",
  },
  breadcrumbSep: {
    marginHorizontal: 6,
    color: "#B6C1CC",
    fontFamily: "Poppins-Regular",
  },

  // Título
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: "#111827",
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },

  // Botão pílula
  ctaRow: {
    alignItems: "center",
    marginBottom: 22,
  },
  ctaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    minWidth: 220,
    alignItems: "center",
  },
  ctaLabel: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },

  // Descrição
  descBox: { marginTop: 6 },
  descTitle: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },

  // Estados
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    fontSize: 14,
    color: "#B00020",
    fontFamily: "Poppins-SemiBold",
  },
});
