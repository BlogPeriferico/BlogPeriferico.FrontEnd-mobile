import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  scroll: {
    paddingBottom: 24,
  },

  /* ----- Box de climatização ----- */
  climatizacaoBox: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  tituloClimatizacao: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
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
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  newsHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderWidth: 1.5,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  /* ----- Card grande (última notícia) ----- */
  leadCard: {
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  leadImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  leadBody: {
    padding: 16,
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  leadSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#374151",
  },

  /* ----- Cards pequenos (layout Figma) ----- */
  itemCard: {
    marginHorizontal: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "stretch", // imagem ocupa altura total
    minHeight: 92,
  },
  itemLeft: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRegion: {
    fontSize: 12,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginRight: 24,
  },
  itemDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  itemThumbRight: {
    width: 116,          // largura fixa para ficar “quadradinho”
    height: "100%",      // ocupa toda a altura do card
    resizeMode: "cover",
  },
  itemThumbRightFallback: {
    width: 116,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },

  /* ----- Botão “Ver mais” ----- */
  verMaisBtn: {
    marginHorizontal: 12,
    marginTop: 14,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  verMaisLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.6,
    fontSize: 13,
  },
});
