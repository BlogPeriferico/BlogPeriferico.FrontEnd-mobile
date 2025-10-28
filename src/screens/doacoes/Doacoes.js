// src/screens/doacoes/Doacoes.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  DeviceEventEmitter,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "../../components/Header";
import DoacaoCard from "../../components/doacao/DoacaoCard";
import DoacaoCarrossel from "../../components/doacao/DoacaoCarrossel";
import { styles as listS } from "../../styles/doacao/DoacoesStyles";
import { useRegionTheme } from "../../utils/regionTheme";
import { getTodasDoacoes, paginaDoacoes } from "../../services/doacoes";
import AddIcon from "../../assets/svgs/Add.svg"; // ⬅️ botão adicionar

const H_PADDING = 16;
const GUTTER = 12;

const SCREEN_W = Dimensions.get("window").width;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GUTTER) / 2;

function norm(x) { return String(x ?? "").toLowerCase().trim(); }
function matchDoacao(item, q) {
  const n = norm(q);
  const campos = [item.titulo, item.descricao, item.local, item.regiao, item.zona, item.categoria];
  return campos.some((c) => norm(c).includes(n));
}
function dedupeById(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr || []) {
    const k = it?.id ?? "";
    if (!seen.has(k)) { seen.add(k); out.push(it); }
  }
  return out;
}

export default function Doacoes({ navigation }) {
  const route = useRoute();
  const { regiao, colors } = useRegionTheme();

  const [base, setBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // paginação (quando NÃO está buscando)
  const [pageState, setPageState] = useState({ page: 1, pageSize: 6, hasMore: true });
  const [itens, setItens] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // busca
  const [query, setQuery] = useState("");
  const [emBusca, setEmBusca] = useState(false);
  const [resultados, setResultados] = useState([]);

  const carregar = useCallback(async () => {
    const data = await getTodasDoacoes();
    const filtradas = dedupeById((data || []).filter((d) => norm(d.regiao ?? d.zona) === norm(regiao)));
    setBase(filtradas);

    if (!emBusca) {
      const pg = paginaDoacoes(filtradas, { page: 1, pageSize: 6 });
      setItens(pg.items);
      setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
    } else {
      const novos = filtradas.filter((d) => matchDoacao(d, query));
      setResultados(novos);
    }
  }, [regiao, emBusca, query]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as doações.");
    } finally {
      setLoading(false);
    }
  }, [carregar]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await carregar();
    } catch {
      Alert.alert("Erro", "Falha ao atualizar as doações.");
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  const handleVerMais = async () => {
    if (!pageState.hasMore || loadingMore || emBusca) return;
    try {
      setLoadingMore(true);
      const next = pageState.page + 1;
      const pg = paginaDoacoes(base, { page: next, pageSize: pageState.pageSize });
      setItens((old) => dedupeById([...old, ...pg.items]));
      setPageState({ page: next, pageSize: pageState.pageSize, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const aplicarBusca = useCallback((q) => {
    const qStr = String(q || "").trim();
    setQuery(qStr);
    if (!qStr) {
      setEmBusca(false);
      const pg = paginaDoacoes(base, { page: 1, pageSize: 6 });
      setItens(pg.items);
      setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
      return;
    }
    setEmBusca(true);
    setResultados(base.filter((i) => matchDoacao(i, qStr)));
  }, [base]);

  // listeners de busca
  useEffect(() => {
    const s1 = DeviceEventEmitter.addListener("search:scope:doacoes", ({ q }) => aplicarBusca(q));
    const s2 = DeviceEventEmitter.addListener("search:DoacoesHome", ({ q }) => aplicarBusca(q));
    const s3 = DeviceEventEmitter.addListener("app:search", ({ q, scope }) => { if (scope === "doacoes") aplicarBusca(q); });
    return () => { s1.remove(); s2.remove(); s3.remove(); };
  }, [aplicarBusca]);

  // via navegação
  useEffect(() => {
    if (typeof route?.params?.q === "string") {
      aplicarBusca(route.params.q);
      try { navigation.setParams({ q: undefined }); } catch {}
    }
  }, [route?.params?.q, aplicarBusca, navigation]);

  const dataRender = emBusca ? resultados : itens;
  const hasMore = !emBusca && pageState.hasMore;

  const goDetalhe = (d) => navigation.navigate("DetalheDoacao", { id: d.id, doacao: d });
  const goNovaDoacao = () => navigation.navigate("NovaDoacao");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ paddingTop: 12, paddingBottom: 8 }}>
          {/* Carrossel logo no topo, com margem discreta */}
          <DoacaoCarrossel navigation={navigation} containerStyle={{ marginBottom: 12 }} />

          {/* Título + Ação (igual outras seções) */}
          <View style={listS.headerRow}>
            <Text style={[listS.tituloSecao, { color: colors.primary }]}>
              {emBusca ? "Resultados de Doações" : "Seleções de Doações"}
            </Text>

            {emBusca ? (
              <TouchableOpacity
                onPress={() => aplicarBusca("")}
                activeOpacity={0.85}
                style={[listS.addBtn, { borderColor: colors.primary, backgroundColor: "#fff", borderWidth: 1 }]}
              >
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Limpar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={goNovaDoacao}
                accessibilityLabel="Adicionar doação"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.9}
                style={[listS.addBtn, { borderColor: colors.primary }]}
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
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
          ) : dataRender.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#6B7280", marginVertical: 16 }}>
              {emBusca ? "Sem resultados para a busca." : "Nenhuma doação nesta região."}
            </Text>
          ) : (
            <>
              <View style={listS.grid}>
                {dataRender.map((d, index) => {
                  const isLeftCol = index % 2 === 0;
                  return (
                    <DoacaoCard
                      key={`${d.id}-${index}`}
                      item={d}
                      regiao={regiao}
                      onPress={() => goDetalhe(d)}
                      style={{ width: CARD_W, marginRight: isLeftCol ? GUTTER : 0 }}
                    />
                  );
                })}
              </View>

              {hasMore && (
                <TouchableOpacity
                  onPress={handleVerMais}
                  disabled={loadingMore}
                  activeOpacity={0.9}
                  style={[listS.verMaisBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={listS.verMaisLabel}>
                    {loadingMore ? "Carregando..." : "Ver mais"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
