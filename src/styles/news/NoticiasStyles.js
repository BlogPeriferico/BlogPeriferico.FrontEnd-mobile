import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  scroll: {
    paddingBottom: 24,
    paddingTop: 8,
  },

  /* ----- Box de climatização ----- */
  climatizacaoBox: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tituloClimatizacao: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  textoClimatizacao: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  link: {
    fontSize: 13,
    fontWeight: "700",
  },

  /* ----- Header da sessão + botão adicionar ----- */
  newsHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 6,
  },
  newsHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  newsHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  newsHeaderSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  addBtn: {
    minWidth: 32,
    height: 32,
    borderWidth: 1.5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  /* ----- Card grande (última notícia) ----- */
  leadCard: {
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  leadImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  leadBody: {
    padding: 16,
  },
  leadChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
  },
  leadTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  leadSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginBottom: 8,
  },
  leadMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  /* ----- Cards pequenos (lista) ----- */
  itemCard: {
    marginHorizontal: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 92,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.025,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemLeft: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 8,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRegion: {
    fontSize: 12,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginRight: 16,
  },
  itemDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  itemThumbRight: {
    width: 116,
    height: "100%",
    resizeMode: "cover",
  },
  itemThumbRightFallback: {
    width: 116,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },

  /* ----- Botão Ver Mais ----- */
  verMaisBtn: {
    marginHorizontal: 12,
    marginTop: 16,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  verMaisLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.6,
    fontSize: 14,
  },

  /* ----- Estado vazio ----- */
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 16,
    fontSize: 13,
  },
});
