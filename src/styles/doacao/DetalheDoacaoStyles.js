import { StyleSheet } from "react-native";

export function createDetalheDoacaoStyles(colors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFFFF" },
    hero: { width: "100%", height: 220, backgroundColor: "#EEE" },
    contentWrap: {
      marginTop: -18,
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },

    // Tipografia
    breadcrumb: {
      fontFamily: "Poppins-Regular", // regular 14
      fontSize: 14,
      color: "#6B7280",
      marginBottom: 10,
    },
    title: {
      fontFamily: "Poppins-Regular", // regular 24
      fontSize: 24,
      color: "#111827",
      marginBottom: 14,
    },

    // Botão WhatsApp (cor por região)
    button: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 999,
      marginBottom: 18,
    },
    buttonText: {
      fontFamily: "Poppins-SemiBold",
      fontSize: 14,
      color: colors.textOnPrimary,
    },

    // Seção Descrição
    sectionLabel: {
      fontFamily: "Poppins-Medium", // medium 18
      fontSize: 18,
      color: "#111827",
      marginBottom: 8,
    },
    descriptionText: {
      fontFamily: "Poppins-SemiBold", // semibold 14
      fontSize: 14,
      color: "#4B5563",
      lineHeight: 20,
    },
  });
}
