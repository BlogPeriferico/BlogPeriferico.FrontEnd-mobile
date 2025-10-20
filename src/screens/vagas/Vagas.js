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
} from "react-native";
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

export default function Vagas({ navigation }) {
  const { regiao, colors } = useRegionTheme();

  const [listaCompleta, setListaCompleta] = useState([]);
  const [itens, setItens] = useState([]);
  const [pageState, setPageState] = useState({ page: 1, pageSize: 6, hasMore: true });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    const data = await getTodasVagas();
    const filtradas = (Array.isArray(data) ? data : []).filter(
      (d) => d.zona?.toLowerCase?.() === regiao?.toLowerCase?.()
    );
    const base = dedupeById(filtradas);
    setListaCompleta(base);
    const pg = paginaVagas(base, { page: 1, pageSize: 6 });
    setItens(pg.items);
    setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
  }, [regiao]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
      console.log("❌ carregar vagas:", e?.message || e);
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
      console.log("❌ refresh vagas:", e?.message || e);
      Alert.alert("Erro", "Falha ao atualizar as vagas.");
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  const handleVerMais = async () => {
    if (!pageState.hasMore || loadingMore) return;
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
          <Text style={[s.tituloSecao, { color: colors.primary }]}>Oportunidades de Vagas</Text>
          <TouchableOpacity
            onPress={goNovaVaga}
            accessibilityLabel="Adicionar vaga"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[s.addBtn, { borderColor: colors.primary }]}
          >
            <AddIcon width={16} height={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : itens.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            Nenhuma vaga disponível nesta região.
          </Text>
        ) : (
          <>
            <View style={s.grid}>
              {itens.map((v, index) => {
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

            {pageState.hasMore && (
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
