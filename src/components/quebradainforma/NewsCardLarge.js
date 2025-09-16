import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function NewsCardLarge({ noticia, onPress }) {
  if (!noticia) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#fff",
        // sem borderRadius
        borderWidth: 1,
        borderColor: "#D9E2EC",
      }}
    >
      {noticia.imagem ? (
        <Image source={{ uri: noticia.imagem }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
      ) : null}

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 8 }}>
          {noticia.titulo}
        </Text>

        <Text numberOfLines={4} style={{ color: "#0c5fd3ff", lineHeight: 20 }}>
          {noticia.subtitulo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
