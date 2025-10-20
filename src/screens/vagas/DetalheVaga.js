import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import { styles as s } from "../../styles/vaga/DetalheVagaStyles";
import { styles as listS } from "../../styles/vaga/VagasStyles";
import VagaCard from "../../components/vaga/VagaCard";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";
import { getTodasVagas, paginaVagas } from "../../services/vagas";

function dedupeById(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = it?.id ?? "";
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 16;
const GUTTER = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GUTTER) / 2;

function normalizePhone(telefone) {
  if (!telefone) return null;
  let digits = String(telefone).replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits || null;
}
function buildWhatsAppLink(telefone, titulo) {
  const normalized = normalizePhone(telefone);
  if (!normalized) return null;
  const texto = encodeURIComponent(
    `Olá! Vi sua vaga${titulo ? `: "${titulo}"` : ""} no Blog Periférico e gostaria de saber mais.`
  );
  return `https://wa.me/${normalized}?text=${texto}`;
}

export default function DetalheVaga({ route, navigation }) {
  const { colors, regiao } = useRegionTheme();
  const vagaParam = route?.params?.vaga;
  const idParam = route?.params?.id;

  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        if (vagaParam) {
          if (live) setVaga(vagaParam);
        } else if (idParam != null) {
          const { data } = await api.get(`/vagas/${idParam}`);
          if (live) setVaga(data);
        }
      } catch (e) {
        if (live) setErro(e?.message || "Erro ao carregar vaga");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [vagaParam, idParam]);

  const whatsappHref = useMemo(
    () => buildWhatsAppLink(vaga?.telefone, vaga?.titulo),
    [vaga?.telefone, vaga?.titulo]
  );

  const onPressWhats = useCallback(async () => {
    if (!whatsappHref) {
      Alert.alert("Contato indisponível", "Telefone inválido ou ausente.");
      return;
    }
    const supported = await Linking.canOpenURL(whatsappHref);
    if (supported) {
      await Linking.openURL(whatsappHref);
    } else {
      Alert.alert("Não foi possível abrir o WhatsApp", whatsappHref);
    }
  }, [whatsappHref]);

  const [relLoading, setRelLoading] = useState(true);
  const [relItens, setRelItens] = useState([]);
  const [relState, setRelState] = useState({ page: 1, pageSize: 6, hasMore: true });

  const carregarRelacionadas = useCallback(async (baseId, zonaAtual) => {
    setRelLoading(true);
    try {
      const data = await getTodasVagas();
      const filtradas = (data || [])
        .filter((v) => v.zona?.toLowerCase?.() === zonaAtual?.toLowerCase?.())
        .filter((v) => String(v.id) !== String(baseId));
      const base = dedupeById(filtradas);
      const pg = paginaVagas(base, { page: 1, pageSize: 6 });
      setRelItens(pg.items);
      setRelState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
    } catch {
      setRelItens([]);
      setRelState({ page: 1, pageSize: 6, hasMore: false });
    } finally {
      setRelLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && vaga && regiao) {
      carregarRelacionadas(vaga.id, regiao);
    }
  }, [loading, vaga, regiao, carregarRelacionadas]);

  const verMaisRelacionadas = useCallback(async () => {
    const data = await getTodasVagas();
    const filtradas = (data || [])
      .filter((v) => v.zona?.toLowerCase?.() === regiao?.toLowerCase?.())
      .filter((v) => String(v.id) !== String(vaga?.id));
    const base = dedupeById(filtradas);
    const next = relState.page + 1;
    const pg = paginaVagas(base, { page: next, pageSize: relState.pageSize });
    setRelItens((old) => dedupeById([...old, ...pg.items]));
    setRelState({ page: next, pageSize: relState.pageSize, hasMore: pg.hasMore });
  }, [regiao, vaga?.id, relState.page, relState.pageSize]);

  return (
    <View style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollBody} bounces>
          {!!vaga?.imagem && (
            <View style={s.headerImageWrap}>
              <Image source={{ uri: vaga.imagem }} style={s.headerImage} resizeMode="cover" />
            </View>
          )}

          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          <View style={s.content}>
            <View style={s.breadcrumbRow}>
              <Text style={s.breadcrumbText}>Home</Text>
              <Text style={s.breadcrumbSep}>›</Text>
              <Text style={s.breadcrumbText}>Vagas</Text>
            </View>

            {loading ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={s.statusText}>Carregando vaga…</Text>
              </View>
            ) : erro ? (
              <View style={s.center}>
                <Text style={s.errorText}>{erro}</Text>
              </View>
            ) : (
              <>
                <Text style={s.title} numberOfLines={3}>
                  {vaga?.titulo || "Vaga"}
                </Text>

                <View style={s.ctaRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressWhats}
                    style={[s.ctaBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[s.ctaLabel, { color: colors.onPrimary || "#FFF" }]}>
                      Contatar o Anunciante
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={s.descBox}>
                  <Text style={s.descTitle}>Descrição</Text>
                  <Text style={s.descText}>
                    {vaga?.descricao?.trim()?.length ? vaga.descricao : "Sem descrição fornecida."}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={{ paddingHorizontal: H_PADDING, paddingTop: 8 }}>
            <Text style={[listS.tituloSecao, { color: colors.primary, marginBottom: 8 }]}>
              Vagas Relacionadas
            </Text>

            {relLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : relItens.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#6B7280", marginVertical: 16 }}>
                Nenhuma vaga semelhante nesta região.
              </Text>
            ) : (
              <>
                <View style={listS.grid}>
                  {relItens.map((v, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <VagaCard
                        key={`${v.id}-${index}`}
                        item={v}
                        regiao={regiao}
                        onPress={() => navigation.push("DetalheVaga", { id: v.id, vaga: v })}
                        style={{ width: CARD_W, marginRight: isLeftCol ? GUTTER : 0 }}
                      />
                    );
                  })}
                </View>

                {relState.hasMore && (
                  <TouchableOpacity
                    onPress={verMaisRelacionadas}
                    activeOpacity={0.9}
                    style={[listS.verMaisBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={listS.verMaisLabel}>Ver mais</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
