import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  imageBox: {
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#7F1D1D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageText: {
    color: "#9CA3AF",
    marginTop: 6,
  },

  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#7F1D1D",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  botao: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
