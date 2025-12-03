import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  page: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 4,
  },

  cardShadow: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  left: {
    flex: 1.2,
    paddingRight: 14,
    justifyContent: "center",
  },

  rightImageWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  heroImage: {
    width: "100%",
    height: 120,
    borderRadius: 14,
  },
  heroImageFallback: {
    width: "100%",
    height: 120,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },

  title: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Nunito-SemiBold",
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    color: "#047857",
    fontFamily: "Nunito-SemiBold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
    fontFamily: "Nunito-Regular",
  },

  ctaRow: {
    marginTop: 16,
    alignItems: "flex-start",
  },

  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    height: 42,
    borderRadius: 999,
  },

  ctaText: {
    fontSize: 14,
    fontFamily: "Nunito-SemiBold",
    color: "#FFFFFF",
    textTransform: "none",
  },

  dotsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 8,
  },

  dotBase: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
  },
});
