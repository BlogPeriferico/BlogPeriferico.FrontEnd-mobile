import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function NewsCardItem({ noticia, onPress, style }) {
  if (!noticia) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 10,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          marginBottom: 10,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 14, fontWeight: "600", color: "#222" }}
        >
          {noticia.titulo}
        </Text>
        <Text
          numberOfLines={2}
          style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}
        >
          {noticia.subtitulo}
        </Text>
        <Text
          style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}
        >
          {noticia.regiao ? `${noticia.regiao} • ` : ""}
          {formatDate(noticia.dataIso)}
        </Text>
      </View>

      {noticia.imagem ? (
        <Image
          source={{ uri: noticia.imagem }}
          style={{ width: 56, height: 56, borderRadius: 8 }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "";
  }
}
