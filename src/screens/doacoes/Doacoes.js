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
import { getTodasDoacoes, paginaDoacoes } from "../../services/doacoes";
import AddIcon from "../../assets/svgs/Add.svg";
import { styles as s } from "../../styles/doacao/DoacoesStyles";
import DoacaoCard from "../../components/doacao/DoacaoCard";
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

export default function Doacao({ navigation }) {
  const { regiao, colors } = useRegionTheme();

  const [listaCompleta, setListaCompleta] = useState([]);
  const [itens, setItens] = useState([]);
  const [pageState, setPageState] = useState({ page: 1, pageSize: 6, hasMore: true });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    const data = await getTodasDoacoes();
    const filtradas = (Array.isArray(data) ? data : []).filter(
      (d) => d.zona?.toLowerCase?.() === regiao?.toLowerCase?.()
    );
    const base = dedupeById(filtradas);
    setListaCompleta(base);
    const pg = paginaDoacoes(base, { page: 1, pageSize: 6 });
    setItens(pg.items);
    setPageState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
  }, [regiao]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
      console.log("❌ carregar doações:", e?.message || e);
      Alert.alert("Erro", "Não foi possível carregar as doações.");
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
      console.log("❌ refresh doações:", e?.message || e);
      Alert.alert("Erro", "Falha ao atualizar as doações.");
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  const handleVerMais = async () => {
    if (!pageState.hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = pageState.page + 1;
      const pg = paginaDoacoes(listaCompleta, { page: nextPage, pageSize: 6 });
      setItens((old) => dedupeById([...old, ...pg.items]));
      setPageState({ page: nextPage, pageSize: 6, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const goNovaDoacao = () => navigation.navigate("NovaDoacao");
  const goDetalhe = (d) => navigation.navigate("DetalheDoacao", { id: d.id, doacao: d });

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
        {/* Carrossel fixo (IDs 15,16,17) */}
        <DoacaoCarrossel navigation={navigation} containerStyle={{ marginBottom: 18 }} />

        {/* Título + botão adicionar */}
        <View style={s.headerRow}>
          <Text style={[s.tituloSecao, { color: colors.primary }]}>
            Seleções De Doações
          </Text>
          <TouchableOpacity
            onPress={goNovaDoacao}
            accessibilityLabel="Adicionar doação"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[s.addBtn, { borderColor: colors.primary }]}
          >
            <AddIcon width={16} height={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Lista / Grid */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : itens.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            Nenhuma doação encontrada nesta região.
          </Text>
        ) : (
          <>
            <View style={s.grid}>
              {itens.map((d, index) => {
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

            {/* Botão VER MAIS */}
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
