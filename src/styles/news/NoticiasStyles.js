import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* ===== Área de Climatização ===== */
  areaClimaCard: {
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)", // borda suave como no mock
  },
  areaClimaTitulo: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#0E1B2A",
    marginBottom: 10,
  },
  areaClimaDesc: {
    textAlign: "left",
    fontSize: 16,
    lineHeight: 22,
    color: "#8B95A5",
    marginBottom: 12,
  },
  areaClimaLink: {
    fontSize: 16,
    color: "#0A3E66",
    fontWeight: "700",
  },

  /* ===== Seção de Notícias / Ícones ===== */
  selecaoNoticias: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0E1B2A",
  },
  iconesLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  /* ===== Lista de notícias ===== */
  cardNoticia: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEEF0",
    gap: 10,
  },
  imagemNoticia: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
  },
  infoNoticia: {
    flex: 1,
  },
  tituloNoticia: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E1B2A",
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 12,
    color: "#7A869A",
  },

  /* ===== Botão VER MAIS ===== */
  botaoMais: {
    backgroundColor: "#F3F5F7",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  textoMais: {
    fontWeight: "bold",
    color: "#0A3E66",
    letterSpacing: 0.5,
  },
});
