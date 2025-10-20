import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles as s } from "../../styles/vaga/VagaCardStyles";

export default function VagaCard({ item, onPress, regiao, style }) {
  const autor = item?.usuarioNome || item?.telefone || null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.card, style]}
      accessibilityRole="button"
      accessibilityLabel={`Abrir vaga ${item?.titulo || "sem título"}`}
    >
      <View style={s.inner}>
        <View style={s.cardImageWrap}>
          {item?.imagem ? (
            <Image source={{ uri: item.imagem }} style={s.cardImage} resizeMode="cover" />
          ) : (
            <View style={[s.cardImage, { backgroundColor: "#F3F4F6" }]} />
          )}
        </View>

        <View style={s.cardBody}>
          <Text style={s.cardTitle} numberOfLines={2}>
            {item?.titulo || "Vaga"}
          </Text>

          {!!autor && (
            <Text style={s.cardMeta} numberOfLines={1}>
              Contato: {autor}
            </Text>
          )}

          <Text style={s.cardMeta} numberOfLines={1}>
            Região: {(item?.zona || regiao || "Centro")
              ?.toLowerCase?.()
              ?.replace(/^./, (c) => c.toUpperCase())}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
