import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
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
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  commentsCount: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  body: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    marginTop: 6,
    marginBottom: 18,
  },
});
