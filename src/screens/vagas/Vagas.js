import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { getTodasVagas, paginaVagas } from "../../services/vagas";
import AddIcon from "../../assets/svgs/Add.svg";
import { styles as s } from "../../styles/vaga/VagasStyles";
import VagaCard from "../../components/vaga/VagaCard";
import DoacaoCarrossel from "../../components/doacao/DoacaoCarrossel";

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

const dbg = (...a) => console.log("💼[Vagas]", ...a);

function norm(x) { return String(x ?? "").toLowerCase().trim(); }
function matchVaga(item, q) {
  const n = norm(q);
  const campos = [
    item.titulo, item.descricao, item.empresa,
    item.local, item.regiao, item.zona, item.categoria,
  ];
  return campos.some((c) => norm(c).includes(n));
}

export default function Vagas({ navigation }) {
  const route = useRoute();
  const { regiao, colors } = useRegionTheme();

  // base
  const [listaCompleta, setListaCompleta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // paginação (quando NÃO buscando)
  const [pageState, setPageState] = useState({ page: 1, pageSize: 6, hasMore: true });
  const [itens, setItens] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // busca
  const [query, setQuery] = useState("");
  const [emBusca, setEmBusca] = useState(false);
  const [resultados, setResultados] = useState([]);

  const carregar = useCallback(async () => {
    const data = await getTodasVagas();
    const filtradas = (Array.isArray(data) ? data : []).filter(
      (d) => norm(d.regiao ?? d.zona) === norm(regiao)
    );
    const base = dedupeById(filtradas);
    setListaCompleta(base);

    if (!emBusca) {
      const pg = paginaVagas(base, { page: 1, pageSize: 6 });
      setItens(pg.items);
      setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
    } else {
      const novos = base.filter((v) => matchVaga(v, query));
      setResultados(novos);
    }
  }, [regiao, emBusca, query]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
      dbg(" carregar vagas:", e?.message || e);
      Alert.alert("Erro", "Não foi possível carregar as vagas.");
    } finally {
      setLoading(false);
    }
  }, [carregar]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await carregar();
    } catch (e) {
      dbg(" refresh vagas:", e?.message || e);
      Alert.alert("Erro", "Falha ao atualizar as vagas.");
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  const handleVerMais = async () => {
    if (!pageState.hasMore || loadingMore || emBusca) return;
    try {
      setLoadingMore(true);
      const nextPage = pageState.page + 1;
      const pg = paginaVagas(listaCompleta, { page: nextPage, pageSize: 6 });
      setItens((old) => dedupeById([...old, ...pg.items]));
      setPageState({ page: nextPage, pageSize: 6, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const aplicarBusca = useCallback((q) => {
    const qStr = String(q || "").trim();
    setQuery(qStr);
    if (!qStr) {
      setEmBusca(false);
      const pg = paginaVagas(listaCompleta, { page: 1, pageSize: 6 });
      setItens(pg.items);
      setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
      return;
    }
    setEmBusca(true);
    setResultados(listaCompleta.filter((i) => matchVaga(i, qStr)));
  }, [listaCompleta]);

  // listeners de busca
  useEffect(() => {
    const s1 = DeviceEventEmitter.addListener("search:scope:vagas", ({ q, from }) => {
      dbg(" escopo", q, "from:", from);
      aplicarBusca(q);
    });
    const s2 = DeviceEventEmitter.addListener("search:VagasHome", ({ q }) => {
      dbg(" rota VagasHome", q);
      aplicarBusca(q);
    });
    const s3 = DeviceEventEmitter.addListener("app:search", ({ q, scope }) => {
      if (scope === "vagas") {
        dbg(" global (scope ok)", q);
        aplicarBusca(q);
      }
    });
    return () => { s1.remove(); s2.remove(); s3.remove(); };
  }, [aplicarBusca]);

  useEffect(() => {
    if (typeof route?.params?.q === "string") {
      aplicarBusca(route.params.q);
      try { navigation.setParams({ q: undefined }); } catch {}
    }
  }, [route?.params?.q, aplicarBusca, navigation]);

  const dataRender = emBusca ? resultados : itens;
  const hasMore = !emBusca && pageState.hasMore;

  const goNovaVaga = () => navigation.navigate("NovaVaga");
  const goDetalhe = (v) => navigation.navigate("DetalheVaga", { id: v.id, vaga: v });

  return (
    <View style={s.container}>
      <Header />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingHorizontal: H_PADDING, paddingTop: 12 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <DoacaoCarrossel navigation={navigation} containerStyle={{ marginBottom: 18 }} />

        <View style={s.headerRow}>
          <Text style={[s.tituloSecao, { color: colors.primary }]}>
            {emBusca ? "Resultados de Vagas" : "Oportunidades de Vagas"}
          </Text>

          {emBusca ? (
            <TouchableOpacity
              onPress={() => aplicarBusca("")}
              accessibilityLabel="Limpar busca"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[s.addBtn, { borderColor: colors.primary, backgroundColor: "#fff", borderWidth: 1 }]}
            >
              <Text style={{ color: colors.primary, fontWeight: "600" }}>Limpar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={goNovaVaga}
              accessibilityLabel="Adicionar vaga"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[s.addBtn, { borderColor: colors.primary }]}
            >
              <AddIcon width={16} height={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {emBusca && (
          <Text style={{ color: "#6B7280", marginBottom: 8 }}>
            {dataRender.length} resultado{dataRender.length === 1 ? "" : "s"}
            {query ? ` para “${query}”` : ""}
          </Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : dataRender.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            {emBusca ? "Sem resultados para a busca." : "Nenhuma vaga disponível nesta região."}
          </Text>
        ) : (
          <>
            <View style={s.grid}>
              {dataRender.map((v, index) => {
                const isLeftCol = index % 2 === 0;
                return (
                  <VagaCard
                    key={`${v.id}-${index}`}
                    item={v}
                    regiao={regiao}
                    onPress={() => goDetalhe(v)}
                    style={{
                      width: CARD_W,
                      marginRight: isLeftCol ? GUTTER : 0,
                    }}
                  />
                );
              })}
            </View>

            {hasMore && (
              <TouchableOpacity
                onPress={handleVerMais}
                disabled={loadingMore}
                activeOpacity={0.9}
                style={[s.verMaisBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={s.verMaisLabel}>
                  {loadingMore ? "Carregando..." : "Ver mais"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
