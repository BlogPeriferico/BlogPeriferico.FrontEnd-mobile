// src/styles/sobre/SobreStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: "100%",
    height: 180,
  },

  box: {
    backgroundColor: "#F2F2F2",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },

  box2: {
    backgroundColor: "#F2F2F2",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  barContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  barLeft: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#0047FF",
    marginRight: 6,
  },
  barRight: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#AE0000",
  },
  sobrenoslight: {
    fontSize: 12,
    color: "#6D6D6D",
    marginTop: 10,
    marginBottom: 4,
  },
  titulo2: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },
  descricao2: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
    marginBottom: 12,
  },
  funcionalidades: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginTop: 4,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4F6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  blueBar: {
    width: 6,
    height: 24,
    borderRadius: 3,
    backgroundColor: "#0047FF",
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
});
