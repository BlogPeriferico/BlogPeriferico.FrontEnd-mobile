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
} from "react-native";

import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { getTodasDoacoes, paginaDoacoes } from "../../services/doacoes";
import AddIcon from "../../assets/svgs/Add.svg";

export default function Doacao({ navigation }) {
  const { colors } = useRegionTheme();
  const [doacoes, setDoacoes] = useState([]);
  const [pageState, setPageState] = useState({ page: 1, pageSize: 5, hasMore: true });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Buscar e paginar doações
  const carregar = useCallback(async () => {
    const data = await getTodasDoacoes();
    const pg = paginaDoacoes(data, { page: 1, pageSize: 5 });
    setDoacoes(pg.items);
    setPageState({ page: 1, pageSize: 5, hasMore: pg.hasMore });
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      await carregar();
    } catch (e) {
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
      const pg = paginaDoacoes(doacoes, { page: nextPage, pageSize: 4 });
      setDoacoes((old) => [...old, ...pg.items]);
      setPageState({ page: nextPage, pageSize: 4, hasMore: pg.hasMore });
    } finally {
      setLoadingMore(false);
    }
  };

  const goNovaDoacao = () => navigation.navigate("NovaDoacao");

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      {/* 🔹 Header igual ao de Notícias */}
      <Header />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* 🔹 Título + botão adicionar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.primary }}>
            Doações disponíveis
          </Text>
          <TouchableOpacity
            onPress={goNovaDoacao}
            accessibilityLabel="Adicionar doação"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              borderWidth: 1,
              borderColor: colors.primary,
              borderRadius: 8,
              padding: 4,
            }}
          >
            <AddIcon width={18} height={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 🔹 Conteúdo */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : doacoes.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            Nenhuma doação encontrada.
          </Text>
        ) : (
          <>
            {doacoes.map((d) => (
              <TouchableOpacity
                key={d.id}
                activeOpacity={0.9}
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {d.imagem ? (
                  <Image
                    source={{ uri: d.imagem }}
                    style={{ width: 70, height: 70, borderRadius: 10 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      backgroundColor: "#E5E7EB",
                      borderRadius: 10,
                    }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontWeight: "bold", color: colors.primary }}
                    numberOfLines={1}
                  >
                    {d.titulo}
                  </Text>
                  <Text style={{ color: "#374151" }} numberOfLines={2}>
                    {d.descricao}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                    {d.telefone || "Sem telefone"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* 🔹 Botão VER MAIS */}
            {pageState.hasMore && (
              <TouchableOpacity
                onPress={handleVerMais}
                disabled={loadingMore}
                activeOpacity={0.9}
                style={{
                  backgroundColor: colors.primary,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {loadingMore ? "Carregando..." : "VER MAIS"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
