// src/styles/sobre/SobreStyles.js

import { StyleSheet } from "react-native";

/**
 * Estilos da tela Sobre, usando o tema de região (colors.primary etc).
 */
export const makeSobreStyles = (colors = {}) => {
  const primary = colors.primary || "#00AEEF";
  const primaryDark = colors.primaryDark || "#73C9FF";
  const background = colors.background || "#F3F4F6";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
      alignItems: "center",
    },

    /* ===== HERO / CAPA ===== */
    cardImagem: {
      width: "100%",
      maxWidth: 420,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: "#020617",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
      position: "relative",
    },
    imagem: {
      width: "100%",
      height: 230,
    },
    overlayGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(15,23,42,0.55)",
    },
    heroContent: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 18,
    },
    heroTag: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.12)",
      marginBottom: 6,
    },
    heroTagText: {
      fontSize: 11,
      color: "#E5E7EB",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontFamily: "Fraunces_400Regular",
    },
    legendaTitulo: {
      fontSize: 18,
      color: "#F9FAFB",
      textAlign: "left",
      marginBottom: 4,
      fontFamily: "Fraunces_400Regular",
    },
    legendaTexto: {
      fontSize: 12,
      color: "#E5E7EB",
      textAlign: "left",
      lineHeight: 18,
      fontFamily: "Fraunces_400Regular",
    },

    /* ===== CARD SOBRE NÓS ===== */
    cardSobre: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      paddingTop: 22,
      paddingBottom: 18,
      paddingHorizontal: 18,
      marginBottom: 20,
      width: "100%",
      maxWidth: 420,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      position: "relative",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    tabs: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      height: 4,
    },
    tabAtiva: {
      flex: 1.6,
      backgroundColor: primary,
      borderTopLeftRadius: 18,
    },
    tabInativa: {
      flex: 1,
      backgroundColor: primaryDark,
      borderTopRightRadius: 18,
    },

    sobreTituloTopo: {
      fontSize: 13,
      color: "#9CA3AF",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      fontFamily: "Fraunces_400Regular",
    },
    sobrePergunta: {
      fontSize: 18,
      color: "#111827",
      marginBottom: 10,
      fontFamily: "Fraunces_400Regular",
    },
    sobreTexto: {
      fontSize: 13,
      color: "#4B5563",
      lineHeight: 20,
      marginBottom: 6,
      fontFamily: "Fraunces_400Regular",
    },
    linkFuncionalidades: {
      marginTop: 8,
      fontSize: 12,
      color: primary,
      fontWeight: "600",
    },

    /* ===== BOTÕES DAS ÁREAS ===== */
    botoesWrapper: {
      width: "100%",
      maxWidth: 420,
      marginBottom: 14,
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 10,
      rowGap: 10,
    },
    botao: {
      flexBasis: "48%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    botaoAtivo: {
      borderColor: primary,
      shadowOpacity: 0.14,
      transform: [{ translateY: -1 }],
    },
    botaoBarra: {
      height: 3,
      width: "100%",
      backgroundColor: "#F3F4F6",
    },
    botaoBarraAtiva: {
      backgroundColor: primary,
    },
    botaoConteudo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingVertical: 10,
      paddingHorizontal: 12,
      columnGap: 8,
    },
    botaoIcon: {
      fontSize: 18,
    },
    botaoTexto: {
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
    },
    botaoTextoAtivo: {
      color: primary,
    },

    /* ===== DESCRIÇÃO SELECIONADA ===== */
    descBox: {
      width: "100%",
      maxWidth: 420,
      marginTop: 4,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: primary,
    },
    descChip: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: "#EEF2FF",
      color: "#4F46E5",
      fontSize: 11,
      marginBottom: 4,
    },
    descTitulo: {
      fontSize: 15,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 4,
    },
    descTexto: {
      fontSize: 13,
      color: "#4B5563",
      lineHeight: 20,
    },

    bottomSpacer: {
      height: 80,
    },
  });
};
