import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
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
import CarrosselDestaquesDoacao from "../../components/doacao/CarrosselDestaquesDoacao";

/** Deduplica por id preservando a ordem */
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

// medidas para 2 colunas com gutter
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 16; // padding horizontal do ScrollView (aplicado no contentContainerStyle)
const GUTTER = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GUTTER) / 2; // 2 colunas

export default function Doacao({ navigation }) {
  const { regiao, colors } = useRegionTheme();

  const [listaCompleta, setListaCompleta] = useState([]); // lista filtrada por região
  const [itens, setItens] = useState([]);                 // itens exibidos (paginados)
  const [pageState, setPageState] = useState({ page: 1, pageSize: 6, hasMore: true });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  React.createElement(CarrosselDestaquesDoacao, {
  navigation,              // passe o navigation da tela
  ids: [15, 16, 17],       // fixo como você pediu
  title: "Doações em destaque"
})

  // Carrega e filtra por região (igual Notícias)
  const carregar = useCallback(async () => {
    const data = await getTodasDoacoes();

    const filtradas = (Array.isArray(data) ? data : []).filter(
      (d) => d.zona?.toLowerCase() === regiao?.toLowerCase()
    );

    const base = dedupeById(filtradas);
    setListaCompleta(base);

    const pg = paginaDoacoes(base, { page: 1, pageSize: 6 }); // 6 por página (3 linhas)
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

  return (
    <View style={s.container}>
      <Header />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingHorizontal: H_PADDING }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
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
              {itens.map((d, index) => (
                <View
                  key={`${d.id}-${index}`}
                  style={[
                    s.card,
                    { width: CARD_W, marginRight: index % 2 === 0 ? GUTTER : 0 },
                  ]}
                >
                  {/* Imagem com cantos arredondados dentro do card */}
                  <View style={s.cardImageWrap}>
                    {d.imagem ? (
                      <Image source={{ uri: d.imagem }} style={s.cardImage} />
                    ) : (
                      <View style={s.cardImage} />
                    )}
                  </View>

                  {/* Conteúdo */}
                  <View style={s.cardBody}>
                    <Text style={s.cardTitle} numberOfLines={2}>
                      {d.titulo || "Doação"}
                    </Text>

                    {(d?.doador?.nome || d?.usuarioNome || d?.autorNome || d?.telefone) && (
                      <Text style={s.cardMeta} numberOfLines={1}>
                        Doador: {d.doador?.nome || d.usuarioNome || d.autorNome || d.telefone}
                      </Text>
                    )}

                    <Text style={s.cardMeta} numberOfLines={1}>
                      Região: {(d.zona || regiao || "Centro")
                        .toLowerCase()
                        .replace(/^./, (c) => c.toUpperCase())}
                    </Text>
                  </View>
                </View>
              ))}
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
