import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator,
} from "react-native";
import Header from "../../components/Header";
import CardClima from "../../components/CardClima";
import { styles } from "../../styles/news/NoticiasStyles";

// Service de notícias (abaixo neste arquivo)
import { getTodasNoticias, paginaNoticias } from "../../services/noticias";



export default function Noticias() {
  const [todas, setTodas] = useState([]);
  const [page, setPage] = useState(1);
  const [lista, setLista] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const all = await getTodasNoticias(); // busca do back e normaliza
        setTodas(all);

        const { items, hasMore } = paginaNoticias(all, { page: 1, pageSize: 5 });
        setLista(items);
        setHasMore(hasMore);
        setPage(1);
      } catch (e) {
        console.log("Erro /noticias:", e?.message || e);
        setError("Não foi possível carregar as notícias.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const carregarMais = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const { items, hasMore: hm } = paginaNoticias(todas, { page: next, pageSize: 5 });
    setLista((old) => [...old, ...items]);
    setHasMore(hm);
    setPage(next);
    setLoadingMore(false);
  };

  const formatDatePT = (iso) => {
    const d = new Date(iso);
    const data = d.toLocaleDateString("pt-BR");
    const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${data} ${hora}`;
  };

  // destaque = primeiro da lista paginada
  const destaque = lista[0];
  const restantes = lista.slice(1);

  const renderNoticia = ({ item }) => (
    <View style={styles.cardNoticia}>
      <Image source={{ uri: item.thumb || item.imagem }} style={styles.imagemNoticia} />
      <View style={styles.infoNoticia}>
        <Text style={styles.tituloNoticia} numberOfLines={2}>
          {item.titulo}
        </Text>
        <Text style={styles.subInfo}>
          {(item.regiao || "Centro")} • {formatDatePT(item.dataIso)}
        </Text>
      </View>
    </View>
  );

  const SelecaoHeader = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
      {/* Cabeçalho “Seleção de notícias” com ícones */}
      

      {/* Card destaque */}
      {destaque && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.08)",
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          <Image
            source={{ uri: destaque.imagem }}
            style={{ width: "100%", height: 160, backgroundColor: "#F2F2F2" }}
          />
          <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: "#0E1B2A", marginBottom: 6 }}
              numberOfLines={2}
            >
              {destaque.titulo}
            </Text>

            {!!destaque.subtitulo && (
              <Text
                style={{ fontSize: 13, lineHeight: 18, color: "#6C7687", marginBottom: 10 }}
                numberOfLines={3}
              >
                {destaque.subtitulo}
              </Text>
            )}

            <Text style={{ fontSize: 12, color: "#7A869A" }}>
              {(destaque.regiao || "Centro")} • {formatDatePT(destaque.dataIso)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card clima */}
        <CardClima />

        {/* Área de climatização */}
        <View style={styles.areaClimaCard}>
          <Text style={styles.areaClimaTitulo}>Área de climatização</Text>
          <Text style={styles.areaClimaDesc}>
            Nossas cores são baseadas nas cores das zonas{"\n"}
            da SpTrans
          </Text>
          <TouchableOpacity onPress={() => { /* TODO: navegar/abrir modal */ }}>
            <Text style={styles.areaClimaLink}>Por que das cores?</Text>
          </TouchableOpacity>
        </View>

        {/* Seleção de notícias */}
        {error ? (
          <Text style={{ color: "red", margin: 16 }}>{error}</Text>
        ) : loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <>
            <FlatList
              data={restantes}
              keyExtractor={(item) => item.id}
              renderItem={renderNoticia}
              scrollEnabled={false}
              ListHeaderComponent={SelecaoHeader}
              contentContainerStyle={{ paddingBottom: 12 }}
            />

            <TouchableOpacity
              style={[styles.botaoMais, (!hasMore || loadingMore) && { opacity: 0.6 }]}
              onPress={carregarMais}
              disabled={!hasMore || loadingMore}
            >
              <Text style={styles.textoMais}>
                {loadingMore ? "CARREGANDO..." : hasMore ? "VER MAIS" : "FIM"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
    
  );
}
