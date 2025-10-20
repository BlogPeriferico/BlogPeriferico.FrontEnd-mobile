import { StyleSheet } from "react-native";

/**
 * Layout igual ao protótipo:
 * - bloco fundo cinza com bom respiro
 * - linha (texto à esquerda + imagem 100x100 à direita)
 * - setas 20x20 centralizadas verticalmente
 * - CTA (100x25) centralizado ABAIXO da linha
 * - dots (80x6) logo abaixo
 */
export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    width: 370,              // largura do card
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,   // respiro igual ao protótipo
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 24,
    position: "relative",
  },

  center: { alignItems: "center", justifyContent: "center", height: 190 },

  // linha principal (altura mínima para comportar a imagem)
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 120,
  },

  left: {
    flex: 1,
    paddingRight: 16, // distância do bloco da imagem
  },

  // Título 12 semibold (1 linha)
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#0F172A",
    marginBottom: 6,
  },

  // Descrição 10 regular (2 linhas)
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#6B7280",
  },

  // Imagem 100x100 (sem radius)
  rightImageWrap: {
    width: 100,
    height: 100,
    backgroundColor: "#E5E7EB",
  },
  rightImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Setas 20x20 centradas na linha
  navBtn: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    top: 20 + 50, // paddingTop (18~20) + metade da imagem (aprox)
  },
  navLeft: { left: 10 },
  navRight: { right: 10 },
  navIcon: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 12,
    fontFamily: "Poppins-SemiBold",
  },

  // CTA centralizado abaixo da linha
  ctaRow: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },
  cta: {
    width: 100,
    height: 25,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaText: { fontFamily: "Poppins-SemiBold", fontSize: 10 },
  ctaArrow: { fontFamily: "Poppins-Bold", fontSize: 12, marginTop: -1 },

  // Dots (3 barras 80x6) alinhados ao centro
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  dot: {
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C4C7CC",
  },
  dotInactive: { opacity: 0.45 },
  dotActive: { opacity: 1 },
});
