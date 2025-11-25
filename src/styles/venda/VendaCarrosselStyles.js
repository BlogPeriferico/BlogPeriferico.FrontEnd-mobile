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
    paddingTop: 4,
    paddingBottom: 4,
  },

  cardShadow: {
    width: "92%",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 22,
      },
      android: {
        elevation: 7,
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
    aspectRatio: 4 / 3,
    borderRadius: 16,
  },

  title: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Nunito-SemiBold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    fontFamily: "Nunito-Regular",
  },

  ctaRow: {
    marginTop: 20,
    alignItems: "flex-start",
  },

  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    height: 46,
    borderRadius: 999,
  },

  ctaText: {
    fontSize: 14,
    fontFamily: "Nunito-SemiBold",
    textTransform: "uppercase",
  },

  ctaArrow: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "700",
  },

  dotsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
  },

  dotBase: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
});
