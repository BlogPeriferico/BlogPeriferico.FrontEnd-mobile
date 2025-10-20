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
import { styles as s } from "../../styles/doacao/DetalheDoacaoStyles";
import { styles as listS } from "../../styles/doacao/DoacoesStyles";
import DoacaoCard from "../../components/doacao/DoacaoCard";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";
import { getTodasDoacoes, paginaDoacoes } from "../../services/doacoes";

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
    `Olá! Vi seu anúncio de doação${titulo ? `: "${titulo}"` : ""} no Blog Periférico e gostaria de saber mais.`
  );
  return `https://wa.me/${normalized}?text=${texto}`;
}

export default function DetalheDoacao({ route, navigation }) {
  const { colors, regiao } = useRegionTheme();

  const doacaoParam = route?.params?.doacao;
  const idParam = route?.params?.id;

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [doacao, setDoacao] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        if (doacaoParam) {
          if (live) setDoacao(doacaoParam);
        } else if (idParam != null) {
          const { data } = await api.get(`/doacoes/${idParam}`);
          if (live) setDoacao(data);
        } else {
          throw new Error("Parâmetros inválidos para abrir a doação.");
        }
      } catch (e) {
        if (live) setErro(e?.message || "Erro ao carregar doação");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [doacaoParam, idParam]);

  const whatsappHref = useMemo(
    () => buildWhatsAppLink(doacao?.telefone, doacao?.titulo),
    [doacao?.telefone, doacao?.titulo]
  );

  const onPressWhats = useCallback(async () => {
    if (!whatsappHref) {
      Alert.alert("Telefone indisponível", "Este anúncio não possui telefone válido para contato.");
      return;
    }
    const supported = await Linking.canOpenURL(whatsappHref);
    if (supported) {
      await Linking.openURL(whatsappHref);
    } else {
      Alert.alert("Não foi possível abrir o WhatsApp", "Copie e cole o link:\n" + whatsappHref);
    }
  }, [whatsappHref]);

  // relacionadas
  const [relLoading, setRelLoading] = useState(true);
  const [relItens, setRelItens] = useState([]);
  const [relState, setRelState] = useState({ page: 1, pageSize: 6, hasMore: true });

  const carregarRelacionadas = useCallback(async (baseId, zonaAtual) => {
    setRelLoading(true);
    try {
      const data = await getTodasDoacoes();
      const filtradas = (Array.isArray(data) ? data : [])
        .filter((d) => d.zona?.toLowerCase?.() === zonaAtual?.toLowerCase?.())
        .filter((d) => String(d.id) !== String(baseId));

      const base = dedupeById(filtradas);
      const pg = paginaDoacoes(base, { page: 1, pageSize: 6 });
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
    if (!loading && doacao && regiao) {
      carregarRelacionadas(doacao.id, regiao);
    }
  }, [loading, doacao, regiao, carregarRelacionadas]);

  const verMaisRelacionadas = useCallback(async () => {
    try {
      const data = await getTodasDoacoes();
      const filtradas = (Array.isArray(data) ? data : [])
        .filter((d) => d.zona?.toLowerCase?.() === regiao?.toLowerCase?.())
        .filter((d) => String(d.id) !== String(doacao?.id));

      const base = dedupeById(filtradas);
      const next = relState.page + 1;
      const pg = paginaDoacoes(base, { page: next, pageSize: relState.pageSize });
      setRelItens((old) => dedupeById([...old, ...pg.items]));
      setRelState({ page: next, pageSize: relState.pageSize, hasMore: pg.hasMore });
    } catch {}
  }, [regiao, doacao?.id, relState.page, relState.pageSize]);

  const goDetalhe = useCallback(
    (d) => navigation.push("DetalheDoacao", { id: d.id, doacao: d }),
    [navigation]
  );

  const irParaListaCompleta = useCallback(
    () => navigation.navigate("DoacoesHome"),
    [navigation]
  );

  return (
    <View style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollBody} bounces>
          {/* Capa */}
          {!!doacao?.imagem && (
            <View style={s.headerImageWrap}>
              <Image source={{ uri: doacao.imagem }} style={s.headerImage} resizeMode="cover" />
            </View>
          )}

          {/* Pegador */}
          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          {/* Conteúdo */}
          <View style={s.content}>
            <View style={s.breadcrumbRow}>
              <Text style={s.breadcrumbText}>Home</Text>
              <Text style={s.breadcrumbSep}>›</Text>
              <Text style={s.breadcrumbText}>Doações</Text>
            </View>

            {loading ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={s.statusText}>Carregando doação…</Text>
              </View>
            ) : erro ? (
              <View style={s.center}>
                <Text style={s.errorText}>{erro}</Text>
              </View>
            ) : (
              <>
                <Text style={s.title} numberOfLines={3}>
                  {doacao?.titulo || "Doação"}
                </Text>

                <View style={s.ctaRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressWhats}
                    style={[s.ctaBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[s.ctaLabel, { color: colors.onPrimary || "#FFF" }]}>
                      Contate o Doador
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={s.descBox}>
                  <Text style={s.descTitle}>Descrição</Text>
                  <Text style={s.descText}>
                    {doacao?.descricao?.trim()?.length ? doacao.descricao : "Sem descrição fornecida."}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Seleções De Doações (reutilizando DoacaoCard) */}
          <View style={{ paddingHorizontal: H_PADDING, paddingTop: 8 }}>
            <Text style={[listS.tituloSecao, { color: colors.primary, marginBottom: 8 }]}>
              Seleções De Doações
            </Text>

            {relLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : relItens.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#6B7280", marginVertical: 16 }}>
                Nenhuma doação semelhante nesta região.
              </Text>
            ) : (
              <>
                <View style={listS.grid}>
                  {relItens.map((d, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <DoacaoCard
                        key={`${d.id}-${index}`}
                        item={d}
                        regiao={regiao}
                        onPress={() => goDetalhe(d)}
                        style={{
                          width: CARD_W,
                          marginRight: isLeftCol ? GUTTER : 0,
                        }}
                      />
                    );
                  })}
                </View>

                {relState.hasMore ? (
                  <TouchableOpacity
                    onPress={verMaisRelacionadas}
                    activeOpacity={0.9}
                    style={[listS.verMaisBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={listS.verMaisLabel}>Ver mais</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={irParaListaCompleta}
                    activeOpacity={0.9}
                    style={[listS.verMaisBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={listS.verMaisLabel}>Ver todas</Text>
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
