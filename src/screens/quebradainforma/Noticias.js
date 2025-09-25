import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";

import Header from "../../components/Header";
import CardClima from "../../components/CardClima";
import AddIcon from "../../assets/svgs/Add.svg";

import { styles as s } from "../../styles/news/NoticiasStyles";
import { getTodasNoticias, paginaNoticias } from "../../services/noticias";
import { useRegionTheme } from "../../utils/regionTheme";

function formatDatePt(dateIso) {
  try {
    const d = new Date(dateIso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = String(d.getFullYear()).slice(-2);
    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${hora}:${min}`;
  } catch {
    return "";
  }
}

export default function Noticias({ navigation }) {
  const { regiao, colors } = useRegionTheme();

  const [listaCompleta, setListaCompleta] = useState([]);
  const [pageState, setPageState] = useState({ page: 1, pageSize: 5, hasMore: true });
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    const data = await getTodasNoticias(); // já ordena desc no service

    // Filtra só notícias da região
    const filtradas = data.filter(
      (n) => n.regiao?.toLowerCase() === regiao?.toLowerCase()
    );

    setListaCompleta(filtradas);
    const pg = paginaNoticias(filtradas, { page: 1, pageSize: 5 });
    setItens(pg.items);
    setPageState({ page: 1, pageSize: 5, hasMore: pg.hasMore });
  }, [regiao]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as notícias.");
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
      Alert.alert("Erro", "Falha ao atualizar as notícias.");
    } finally {
      setRefreshing(false);
    }
  }, [carregar]);

  const handleVerMais = async () => {
    if (!pageState.hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = pageState.page + 1;
      const pg = paginaNoticias(listaCompleta, { page: nextPage, pageSize: 4 }); // +4 por clique
      setItens((old) => [...old, ...pg.items]);
      setPageState({ page: nextPage, pageSize: 4, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const ultima = itens?.[0];
  const restantes = useMemo(() => (itens?.length > 1 ? itens.slice(1) : []), [itens]);

  const goNovaNoticia = () => navigation.navigate("NovaNoticia");
  const goDetalhe = (noticia) => navigation.navigate("DetalheNoticia", { noticia });

  return (
    <View style={s.container}>
      <Header />

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* CLIMA */}
        <CardClima />

        {/* BOX CLIMATIZAÇÃO */}
        <View style={s.climatizacaoBox}>
          <Text style={s.tituloClimatizacao}>Área de climatização</Text>
          <Text style={s.textoClimatizacao}>
            Nossas cores são baseadas nas cores das zonas da SpTrans
          </Text>
          <TouchableOpacity>
            <Text style={[s.link, { color: colors.primary }]}>Por que das cores?</Text>
          </TouchableOpacity>
        </View>

        {/* TÍTULO SESSÃO + BOTÃO ADICIONAR */}
        <View style={s.newsHeaderRow}>
          <Text style={s.newsHeaderTitle}>Seleção de notícias</Text>
          <TouchableOpacity
            onPress={goNovaNoticia}
            accessibilityLabel="Adicionar notícia"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[s.addBtn, { borderColor: colors.primary }]}
          >
            <AddIcon width={18} height={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* CARD GRANDE (última) */}
            {ultima ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => goDetalhe(ultima)}
                style={s.leadCard}
              >
                {ultima.imagem ? (
                  <Image source={{ uri: ultima.imagem }} style={s.leadImage} />
                ) : null}
                <View style={s.leadBody}>
                  <Text style={s.leadTitle}>{ultima.titulo}</Text>
                  {!!ultima.subtitulo && (
                    <Text style={s.leadSubtitle} numberOfLines={6}>
                      {ultima.subtitulo}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ) : null}

            {/* LISTA DOS DEMAIS — layout Figma */}
            {restantes.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                onPress={() => goDetalhe(item)}
                style={s.itemCard}
              >
                {/* bloco texto à esquerda */}
                <View style={s.itemLeft}>
                  <Text style={s.itemTitle} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                  <View style={s.itemMetaRow}>
                    <Text style={s.itemRegion} numberOfLines={1}>
                      {(item.regiao || "Centro").toUpperCase()}
                    </Text>
                    <Text style={s.itemDate} numberOfLines={1}>
                      {formatDatePt(item.dataIso)}
                    </Text>
                  </View>
                </View>

                {/* imagem à direita ocupando a altura */}
                {item.thumb ? (
                  <Image source={{ uri: item.thumb }} style={s.itemThumbRight} />
                ) : (
                  <View style={s.itemThumbRightFallback} />
                )}
              </TouchableOpacity>
            ))}

            {/* BOTÃO VER MAIS */}
            {pageState.hasMore ? (
              <TouchableOpacity
                onPress={handleVerMais}
                disabled={loadingMore}
                activeOpacity={0.9}
                style={[s.verMaisBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={s.verMaisLabel}>
                  {loadingMore ? "Carregando..." : "VER MAIS"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
