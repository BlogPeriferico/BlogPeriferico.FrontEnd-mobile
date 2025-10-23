import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles as s } from "../../styles/doacao/DoacaoCardStyles";


export default function DoacaoCard({ item, onPress, regiao, style }) {
  const doador =
    item?.doador?.nome || item?.usuarioNome || item?.autorNome || item?.telefone || null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.card, style]}
      accessibilityRole="button"
      accessibilityLabel={`Abrir doação ${item?.titulo || "sem título"}`}
    >
      {/* Conteúdo com padding interno */}
      <View style={s.inner}>
        {/* Imagem com radius dentro do card */}
        <View style={s.cardImageWrap}>
          {item?.imagem ? (
            <Image source={{ uri: item.imagem }} style={s.cardImage} resizeMode="cover" />
          ) : (
            <View style={[s.cardImage, { backgroundColor: "#F3F4F6" }]} />
          )}
        </View>

        {/* Texto */}
        <View style={s.cardBody}>
          <Text style={s.cardTitle} numberOfLines={2}>
            {item?.titulo || "Doação"}
          </Text>

          {!!doador && (
            <Text style={s.cardMeta} numberOfLines={1}>
              Doador: {doador}
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
