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
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  comentarioToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  // 🔹 Seção de comentários
  comentariosContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  comentariosTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  comentarioItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
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
});
