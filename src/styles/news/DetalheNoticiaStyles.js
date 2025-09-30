import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  notFoundButton: {
    padding: 10,
  },
  notFoundButtonText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  topBar: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  cover: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D1D5DB",
    marginRight: 10,
  },
  author: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  metaSubRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  body: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    marginTop: 6,
    marginBottom: 18,
  },

  // 🔹 Toggle de comentários
  comentarioToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 12,
  },
  comentarioToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  // 🔹 Seção de comentários
  comentariosContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  comentariosTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  comentarioItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D5DB",
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  comentarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  comentarioNome: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
  },
  comentarioData: {
    fontSize: 12,
    color: "#6B7280",
  },
  comentarioTexto: {
    fontSize: 14,
    color: "#374151",
  },
  semComentarios: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 10,
  },

  // 🔹 Novo comentário (estilo YouTube)
  novoComentarioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  novoComentarioInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    fontSize: 14,
    paddingVertical: 4,
    color: "#111827",
  },
  botaoPublicar: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2563EB",
    borderRadius: 6,
    marginBottom: 10,
  },
  botaoPublicarTexto: {
    color: "#fff",
    fontWeight: "600",
  },
});
