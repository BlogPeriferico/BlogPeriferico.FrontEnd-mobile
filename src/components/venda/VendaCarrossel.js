import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Animated,
} from "react-native";

import { styles as s } from "../../styles/venda/VendaCarrosselStyles";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";

const FIXED_IDS = [2, 3, 4]; // ⬅️ igual doação, fixo
const { width: SCREEN_W } = Dimensions.get("window");

function normalizePhone(tel) {
  if (!tel) return null;
  let d = String(tel).replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  return d || null;
}

function waLink(tel, titulo) {
  const n = normalizePhone(tel);
  if (!n) return null;
  const msg = encodeURIComponent(
    `Olá! Vi sua venda${titulo ? `: "${titulo}"` : ""} no Blog Periférico e gostaria de saber mais.`
  );
  return `https://wa.me/${n}?text=${msg}`;
}

const fmtBRL = (n) => {
  if (n == null || isNaN(n)) return "";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(n));
  } catch {
    return `R$ ${Number(n).toFixed(2)}`.replace(".", ",");
  }
};

export default function VendaCarrossel({ navigation, containerStyle }) {
  const { colors } = useRegionTheme();
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const reqs = FIXED_IDS.map((id) =>
          api
            .get(`/vendas/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        );

        const all = (await Promise.all(reqs)).filter(Boolean);
        if (live) setItens(all);
      } catch (e) {
        console.log("❌ [VendaCarrossel] erro:", e?.message || e);
        if (live) setItens([]);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  const abrirDetalhe = (item) => {
    navigation.navigate("DetalheVenda", { id: item.id, venda: item });
  };

  const contato = async (item) => {
    const link = waLink(item?.telefone, item?.titulo);
    if (!link) return Alert.alert("Telefone indisponível");
    const ok = await Linking.canOpenURL(link);
    ok ? Linking.openURL(link) : Alert.alert("Erro ao abrir", link);
  };

  if (loading) {
    return (
      <View style={[s.container, s.center, containerStyle]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!itens.length) return null;

  const CARD_WIDTH = SCREEN_W * 0.9; // mesmo padrão do Vaga/Doação

  return (
    <View style={[s.container, containerStyle]}>
      <Animated.FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ alignItems: "stretch" }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[s.page, { width: SCREEN_W }]}>
            <Pressable
              style={[s.cardShadow, { width: CARD_WIDTH }]}
              onPress={() => abrirDetalhe(item)}
            >
              <View style={s.row}>
                <View style={s.left}>
                  <Text style={s.title} numberOfLines={2}>
                    {item.titulo || "Venda"}
                  </Text>

                  {!!item.valor && (
                    <Text style={s.price} numberOfLines={1}>
                      {fmtBRL(item.valor)}
                    </Text>
                  )}

                  <Text style={s.subtitle} numberOfLines={3} ellipsizeMode="tail">
                    {item.descricao || "Sem descrição disponível."}
                  </Text>
                </View>

                <View style={s.rightImageWrap}>
                  {item.imagem ? (
                    <Image
                      source={{ uri: item.imagem }}
                      style={s.heroImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={s.heroImageFallback} />
                  )}
                </View>
              </View>

              <View style={s.ctaRow}>
                <TouchableOpacity
                  onPress={() => contato(item)}
                  activeOpacity={0.9}
                  style={[
                    s.cta,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      s.ctaText,
                      { color: colors.onPrimary || "#FFF" },
                    ]}
                  >
                    Falar com vendedor
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        )}
      />

      <View style={s.dotsRow}>
        {itens.map((_, i) => {
          const inputRange = [
            (i - 1) * SCREEN_W,
            i * SCREEN_W,
            (i + 1) * SCREEN_W,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.3, 1],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={String(i)}
              style={[
                s.dotBase,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
