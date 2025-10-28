import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { styles as s } from "../../styles/doacao/DoacaoCarrosselStyles";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";

const FIXED_IDS = [15, 16, 17];
const AUTOPLAY_MS = 5000;

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
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const reqs = FIXED_IDS.map((id) =>
          api.get(`/doacoes/${id}`).then(r => r.data).catch(() => null)
        );
        const all = (await Promise.all(reqs)).filter(Boolean);
        if (live) setItens(all);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!itens.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % itens.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [itens]);

  const next = () => setIndex(i => (i + 1) % itens.length);
  const prev = () => setIndex(i => (i - 1 + itens.length) % itens.length);

  const item = itens[index];

  const abrirDetalhe = () => {
    if (!item) return;
    navigation.navigate("DetalheDoacao", { id: item.id, doacao: item });
  };

  const contato = async () => {
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
  if (!item) return null;

  return (
    <View style={s.wrapper}>
      {/* Conteúdo principal  */}
      <Pressable style={s.row} onPress={abrirDetalhe}>
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

        <TouchableOpacity onPress={prev} style={[s.navBtn, s.navLeft]}>
          <Text style={s.navIcon}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={next} style={[s.navBtn, s.navRight]}>
          <Text style={s.navIcon}>›</Text>
        </TouchableOpacity>
      </Pressable>

      <View style={s.ctaRow}>
        <TouchableOpacity
          onPress={contato}
          activeOpacity={0.9}
          style={[s.cta, { backgroundColor: colors.primary }]}
        >
          <Text style={[s.ctaText, { color: colors.onPrimary || "#FFF" }]}>
            ENTRE EM CONTATO
          </Text>
          <Text style={[s.ctaArrow, { color: colors.onPrimary || "#FFF" }]}>➜</Text>
        </TouchableOpacity>
      </View>

      <View style={s.dotsRow}>
        {itens.map((_, i) => (
          <View key={String(i)} style={[s.dot, i === index ? s.dotActive : s.dotInactive]} />
        ))}
      </View>
    </View>
  );
}
