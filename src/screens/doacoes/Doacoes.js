import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DoacoesScreen() {
  return (
    <View style={styles.container}>
      {/* === Espaço reservado pro carrossel === */}
      <View style={styles.carrosselPlaceholder}>
        <Text style={styles.placeholderText}>[ Carrossel de Doações aqui ]</Text>
      </View>

      {/* === Cabeçalho === */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Seleção de Doações</Text>

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => alert("Adicionar nova doação")}
        >
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {/* === Cards (a definir depois) === */}
      <View style={styles.cardsContainer}>
        <View style={styles.cardPlaceholder}>
          <Text style={styles.placeholderText}>[ Cards de doações vão aqui ]</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  carrosselPlaceholder: {
    height: 220,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: "#aaa",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
  },

  titulo: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontSize: 26,
    color: "#003459",
  },

  botaoAdicionar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#000000ff",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },

  cardsContainer: {
    padding: 16,
  },

  cardPlaceholder: {
    backgroundColor: "#f3f3f3",
    height: 150,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
