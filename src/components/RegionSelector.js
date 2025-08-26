import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { getRegionColors } from "../utils/regionColors";
import { useRegiao } from "../contexts/RegionContext";
import { LinearGradient } from "expo-linear-gradient";

const REGIOES = [
  "centro","norte","sul","leste","oeste",
  "sudeste","sudoeste","noroeste","noroeste2"
];

export default function RegionSelector({ visible, onClose }) {
  const { regiao, setRegiao } = useRegiao();

  const renderItem = ({ item }) => {
    const [c1, c2] = getRegionColors(item);
    const ativo = regiao === item;

    return (
      <TouchableOpacity
        onPress={() => {
          setRegiao(item);
          onClose?.();
        }}
        activeOpacity={0.85}
        style={{ marginBottom: 10, borderRadius: 8, overflow: "hidden" }}
      >
        <LinearGradient
          colors={[c1, c2]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            opacity: ativo ? 1 : 0.8,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#fff",
              marginRight: 8,
              opacity: ativo ? 1 : 0.6,
            }}
          />
          <Text style={{ color: "#fff", fontWeight: ativo ? "800" : "600", fontSize: 14 }}>
            {item.replace("noroeste2", "noroeste (2)")}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "70%" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
            Escolha a região
          </Text>
          <FlatList
            data={REGIOES}
            keyExtractor={(i) => i}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 12,
              alignSelf: "flex-end",
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "#eee",
              borderRadius: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
