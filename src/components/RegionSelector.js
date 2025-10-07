import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getRegionColors } from "../utils/regionColors";
import { useRegiao } from "../contexts/RegionContext";

const REGIOES = [
  "centro","norte","sul","leste","oeste",
  "sudeste","sudoeste","nordeste","noroeste"
];

export default function RegionSelector({ visible, onClose }) {
  const { regiao, setRegiao } = useRegiao();

  // garante que onClose é função
  const safeClose = React.useCallback(() => {
    if (typeof onClose === "function") onClose();
  }, [onClose]);

  const renderItem = ({ item }) => {
    const [c1, c2] = getRegionColors(item);
    const ativo = regiao === item;

    return (
      <TouchableOpacity
        onPress={() => {
          setRegiao(item);
          safeClose(); // fecha com segurança
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
            opacity: ativo ? 1 : 0.85,
          }}
        >
          <View
            style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: "#fff", marginRight: 8,
              opacity: ativo ? 1 : 0.7,
            }}
          />
          <Text style={{ color: "#fff", fontWeight: ativo ? "800" : "600", fontSize: 14 }}>
            {item === "noroeste2" ? "noroeste (2)" : item}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={safeClose}  // Android back
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "70%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", flex: 1 }}>Escolha a região</Text>

            {/* X de fechar — chama safeClose (função) */}
            <TouchableOpacity onPress={safeClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "800" }}>×</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={REGIOES}
            keyExtractor={(i) => i}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity
            onPress={safeClose}
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
