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
  DeviceEventEmitter,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "../../components/Header";
import CardClima from "../../components/CardClima";
import AddIcon from "../../assets/svgs/Add.svg";

import { styles as s } from "../../styles/news/NoticiasStyles";
import { getTodasNoticias, paginaNoticias } from "../../services/noticias";
import { useRegionTheme } from "../../utils/regionTheme";

const dbg = (...a) => console.log("🗞️[Noticias]", ...a);

function normalizeStr(v) {
  return String(v ?? "").trim().toLowerCase();
}

function matchesQuery(n, q) {
  if (!q) return true;
  const query = normalizeStr(q);
  const campos = [
    n.titulo,
    n.subtitulo,
    n.texto,
    n.descricao,
    n.local,
    n.regiao || n.zona,
  ];
  return campos.some((c) => normalizeStr(c).includes(query));
}

function formatDatePt(dateIso) {
  try {
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return "";
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
  const route = useRoute();
  const { regiao, colors } = useRegionTheme();

  // base
  const [listaCompleta, setListaCompleta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // paginação do feed normal
  const [pageState, setPageState] = useState({ page: 1, pageSize: 5, hasMore: true });
  const [itens, setItens] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // busca
  const [query, setQuery] = useState("");
  const [emBusca, setEmBusca] = useState(false);
  const [resultados, setResultados] = useState([]); 

  const carregar = useCallback(async () => {
    const data = await getTodasNoticias(); 
    //  Filtro por região — ajuste para zona se o seu backend usa 'zona':
    const filtradas = (data || []).filter(
      (n) =>
        String(n.regiao ?? n.zona ?? "").toLowerCase() === String(regiao ?? "").toLowerCase()
    );
    setListaCompleta(filtradas);

    // se NÃO está buscando, inicializa feed com paginação
    if (!emBusca) {
      const pg = paginaNoticias(filtradas, { page: 1, pageSize: 5 });
      setItens(pg.items);
      setPageState({ page: 1, pageSize: 5, hasMore: pg.hasMore });
    } else {
      // se está buscando, atualiza resultados com nova base
      const novos = filtradas.filter((n) => matchesQuery(n, query));
      setResultados(novos);
    }
  }, [regiao, emBusca, query]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
      dbg("ERRO carregar:", e?.message || e);
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
    if (!pageState.hasMore || loadingMore || emBusca) return;
    try {
      setLoadingMore(true);
      const nextPage = pageState.page + 1;
      const pg = paginaNoticias(listaCompleta, { page: nextPage, pageSize: 4 });
      setItens((old) => [...old, ...pg.items]);
      setPageState({ page: nextPage, pageSize: 4, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const aplicarBusca = useCallback(
    (q) => {
      const qStr = String(q || "").trim();
      setQuery(qStr);
      if (!qStr) {
        // limpa busca 
        setEmBusca(false);
        const pg = paginaNoticias(listaCompleta, { page: 1, pageSize: 5 });
        setItens(pg.items);
        setPageState({ page: 1, pageSize: 5, hasMore: pg.hasMore });
        return;
      }
      setEmBusca(true);
      const filtrados = (listaCompleta || []).filter((n) => matchesQuery(n, qStr));
      dbg("BUSCA", qStr, "->", filtrados.length);
      setResultados(filtrados);
    },
    [listaCompleta]
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("app:search", ({ q }) => {
      aplicarBusca(q);
      
    });
    return () => sub.remove();
  }, [aplicarBusca]);

  useEffect(() => {
    const q = route?.params?.q;
    if (typeof q === "string") {
      aplicarBusca(q);
      try {
        navigation.setParams({ q: undefined });
      } catch {}
    }
  }, [route?.params?.q, aplicarBusca, navigation]);

  const ultima = useMemo(() => (emBusca ? null : itens?.[0]), [emBusca, itens]);
  const restantes = useMemo(() => {
    if (emBusca) return resultados; 
    return itens?.length > 1 ? itens.slice(1) : [];
  }, [emBusca, itens, resultados]);

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

        {/* TÍTULO SESSÃO + BOTÃO ADICIONAR + status da busca */}
        <View style={s.newsHeaderRow}>
          <Text style={s.newsHeaderTitle}>
            {emBusca ? "Resultados da busca" : "Seleção de notícias"}
          </Text>

          {emBusca ? (
            <TouchableOpacity
              onPress={() => aplicarBusca("")}
              accessibilityLabel="Limpar busca"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[s.addBtn, { borderColor: colors.primary, paddingHorizontal: 10 }]}
            >
              <Text style={{ color: colors.primary, fontWeight: "600" }}>Limpar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={goNovaNoticia}
              accessibilityLabel="Adicionar notícia"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[s.addBtn, { borderColor: colors.primary }]}
            >
              <AddIcon width={18} height={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {emBusca && (
          <Text style={{ color: "#6B7280", marginBottom: 8 }}>
            {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
            {query ? ` para “${query}”` : ""}
          </Text>
        )}

        {loading ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* CARD GRANDE (última) */}
            {!emBusca && ultima ? (
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

            {/* LISTA (restante ou resultados de busca) */}
            {restantes.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                activeOpacity={0.88}
                onPress={() => goDetalhe(item)}
                style={s.itemCard}
              >
                <View style={s.itemLeft}>
                  <Text style={s.itemTitle} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                  <View style={s.itemMetaRow}>
                    <Text style={s.itemRegion} numberOfLines={1}>
                      {String(item.regiao || item.zona || "Centro").toUpperCase()}
                    </Text>
                    <Text style={s.itemDate} numberOfLines={1}>
                      {formatDatePt(item.dataHoraCriacao)}
                    </Text>
                  </View>
                </View>

                {item.thumb || item.imagem ? (
                  <Image source={{ uri: item.thumb || item.imagem }} style={s.itemThumbRight} />
                ) : (
                  <View style={s.itemThumbRightFallback} />
                )}
              </TouchableOpacity>
            ))}

            {/* BOTÃO VER MAIS */}
            {!emBusca && pageState.hasMore ? (
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

            {/* vazio */}
            {!loading && restantes.length === 0 && (
              <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 12 }}>
                {emBusca ? "Sem resultados para a busca." : "Sem notícias nesta região."}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
