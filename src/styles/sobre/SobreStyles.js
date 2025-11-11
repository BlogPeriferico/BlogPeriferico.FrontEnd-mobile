// src/styles/sobre/SobreStyles.js

import { StyleSheet } from "react-native";

/**
 * Estilos da tela Sobre, usando o tema de região (colors.primary etc).
 * `colors` vem do useRegionTheme(): { primary, primaryDark, border, soft, textOnPrimary }
 */
export const makeSobreStyles = (colors = {}) => {
  const primary = colors.primary || "#00AEEF";
  const primaryDark = colors.primaryDark || "#73C9FF"; // segunda cor da região
  const background = colors.background || "#fff";

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
      paddingBottom: 16,
    },

    /* CARD IMAGEM */
    cardImagem: {
      backgroundColor: "#F5F5F5",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 16,
      alignSelf: "center",
      width: "100%",
      maxWidth: 370,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    imagem: {
      width: "100%",
      height: 230,
    },
    legendaWrapper: {
      paddingTop: 18,
      paddingBottom: 18,
      paddingHorizontal: 24,
      backgroundColor: "#F5F5F5",
      alignItems: "center",
    },
    legendaTitulo: {
      fontSize: 14,
      color: "#000000",
      textAlign: "center",
      marginBottom: 6,
      fontFamily: "Fraunces_400Regular", // título regular
    },
    legendaTexto: {
      fontSize: 12,
      color: "#6D6E76",
      textAlign: "center",
      lineHeight: 18,
      fontFamily: "Fraunces_400Regular", // subtítulo regular também
    },

    /* CARD SOBRE NÓS */
    cardSobre: {
      backgroundColor: "#F7F6F5",
      borderRadius: 14,
      paddingTop: 18,
      paddingBottom: 18,
      paddingHorizontal: 18,
      marginBottom: 18,
      alignSelf: "center",
      width: "100%",
      maxWidth: 370,
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      position: "relative",
    },

    /* Barras superiores usando cores da região */
    tabs: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      height: 6,
    },
    tabAtiva: {
      flex: 1.6,
      backgroundColor: primary,
      borderTopLeftRadius: 14,
    },
    tabInativa: {
      flex: 1,
      backgroundColor: primaryDark,
      borderTopRightRadius: 14,
    },

    /* "Sobre nós" label */
    sobreTituloTopo: {
      fontSize: 14,
      color: "#6D6E76",
      marginBottom: 6,
      fontFamily: "Fraunces_400Regular",
    },

    /* Pergunta */
    sobrePergunta: {
      fontSize: 16,
      color: "#000000",
      marginBottom: 10,
      fontFamily: "Fraunces_400Regular",
    },

    /* Parágrafo */
    sobreTexto: {
      fontSize: 12,
      color: "#6D6E76",
      lineHeight: 18,
      marginBottom: 4,
      fontFamily: "Fraunces_400Regular",
    },

    linkFuncionalidades: {
      marginTop: 6,
      fontSize: 11,
      color: primary,
      // se estiver usando Poppins pelo @expo-google-fonts:
      // fontFamily: "Poppins_500Medium",
    },

    /* BOTÕES */
    botoesWrapper: {
      marginBottom: 10,
      gap: 8,
    },
    botao: {
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E3E3E3",
      elevation: 2,
      overflow: "hidden",
      marginBottom: 6,
    },
    botaoAtivo: {
      borderColor: primary,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      transform: [{ translateY: -1 }],
    },
    botaoBarra: {
      height: 3,
      width: "100%",
      backgroundColor: "#EEEEEE",
    },
    botaoBarraAtiva: {
      backgroundColor: primary,
    },
    botaoConteudo: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      gap: 10,
    },
    botaoIcon: {
      fontSize: 20,
    },
    botaoTexto: {
      fontSize: 17,
      fontWeight: "600",
      color: "#444444",
    },
    botaoTextoAtivo: {
      color: primary,
      fontWeight: "700",
    },

    /* DESCRIÇÃO SELECIONADA */
    descBox: {
      marginTop: 4,
      padding: 10,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E3E3E3",
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: primary,
    },
    descTitulo: {
      fontSize: 14,
      fontWeight: "700",
      color: primary,
      marginBottom: 4,
    },
    descTexto: {
      fontSize: 13,
      color: "#444444",
      lineHeight: 18,
    },

    bottomSpacer: {
      height: 80,
    },
  });
};
