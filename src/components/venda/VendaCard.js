// src/components/venda/VendaCard.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles as s } from "../../styles/venda/VendaCardStyles";

const fmtBRL = (n) => {
  if (n == null || isNaN(n)) return "";
  try { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(n)); }
  catch { return `R$ ${Number(n).toFixed(2)}`.replace(".", ","); }
};

export default function VendaCard({ item, onPress, regiao, style }) {
  const preco = fmtBRL(item?.valor);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.card, style]}
      accessibilityRole="button"
      accessibilityLabel={`Abrir venda ${item?.titulo || "sem título"}`}
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
          <Text style={s.cardTitle} numberOfLines={2}>{item?.titulo || "Venda"}</Text>

          {!!preco && (
            <Text style={[s.cardMeta, { fontWeight: "700", color: "#111827" }]} numberOfLines={1}>
              {preco}
            </Text>
          )}

          <Text style={s.cardMeta} numberOfLines={1}>
            Região: {(item?.zona || regiao || "Centro")?.toLowerCase?.()?.replace(/^./, (c) => c.toUpperCase())}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
