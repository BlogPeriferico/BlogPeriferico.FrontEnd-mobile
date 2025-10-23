import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { styles as s } from "../../styles/doacao/DoacaoCarrosselStyles";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";

const FIXED_IDS = [15, 16, 17];
const { width } = Dimensions.get("window");

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
    `Olá! Vi sua doação${titulo ? `: "${titulo}"` : ""} no Blog Periférico e gostaria de saber mais.`
  );
  return `https://wa.me/${n}?text=${msg}`;
}

export default function DoacaoCarrossel({ navigation }) {
  const { colors } = useRegionTheme();
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const reqs = FIXED_IDS.map((id) =>
          api.get(`/doacoes/${id}`).then((r) => r.data).catch(() => null)
        );
        const all = (await Promise.all(reqs)).filter(Boolean);
        if (live) setItens(all);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollX / width);
    setActiveIndex(newIndex);
  };

  const abrirDetalhe = (item) => {
    navigation.navigate("DetalheDoacao", { id: item.id, doacao: item });
  };

  const contato = async (item) => {
    const link = waLink(item?.telefone, item?.titulo);
    if (!link) return Alert.alert("Telefone indisponível");
    const ok = await Linking.canOpenURL(link);
    ok ? Linking.openURL(link) : Alert.alert("Erro ao abrir", link);
  };

  if (loading) {
    return (
      <View style={[s.wrapper, s.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!itens.length) return null;

  return (
    <View style={{ alignItems: "center" }}>
      <FlatList
        data={itens}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={[s.wrapper, { width }]}>
            {/* Press para abrir detalhe */}
            <Pressable style={s.row} onPress={() => abrirDetalhe(item)}>
              <View style={s.left}>
                <Text style={s.title} numberOfLines={1} ellipsizeMode="tail">
                  {item.titulo || "Doação"}
                </Text>
                <Text style={s.subtitle} numberOfLines={2} ellipsizeMode="tail">
                  {item.descricao || "Sem descrição disponível."}
                </Text>
              </View>

              <View style={s.rightImageWrap}>
                {item.imagem ? (
                  <Image source={{ uri: item.imagem }} style={s.rightImage} />
                ) : (
                  <View style={[s.rightImage, { backgroundColor: "#E5E7EB" }]} />
                )}
              </View>
            </Pressable>

            {/* CTA */}
            <View style={s.ctaRow}>
              <TouchableOpacity
                onPress={() => contato(item)}
                activeOpacity={0.9}
                style={[s.cta, { backgroundColor: colors.primary }]}
              >
                <Text style={[s.ctaText, { color: colors.onPrimary || "#FFF" }]}>
                  ENTRE EM CONTATO
                </Text>
                <Text style={[s.ctaArrow, { color: colors.onPrimary || "#FFF" }]}>➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={s.dotsRow}>
        {itens.map((_, i) => (
          <View key={String(i)} style={[s.dot, i === activeIndex ? s.dotActive : s.dotInactive]} />
        ))}
      </View>
    </View>
  );
}
