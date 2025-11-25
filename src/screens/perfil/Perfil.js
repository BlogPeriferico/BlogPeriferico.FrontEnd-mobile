import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import { styles as s } from "../../styles/perfil/PerfilStyles";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";
import { getUserId } from "../../services/auth";

// cards
import NewsCardItem from "../../components/quebradainforma/NewsCardItem";
import DoacaoCard from "../../components/doacao/DoacaoCard";
import VendaCard from "../../components/venda/VendaCard";
import VagaCard from "../../components/vaga/VagaCard";

// serviços de listagem
import { getTodasNoticias } from "../../services/noticias";
import { getTodasDoacoes } from "../../services/doacoes";
import { getTodasVendas } from "../../services/vendas";
import { getTodasVagas } from "../../services/vagas";

import AvatarPlaceholder from "../../assets/svgs/avatar-placeholder.svg";

/* Helpers pra ID do dono */
function normId(x) {
  const n = Number(x);
  return Number.isNaN(n) ? null : n;
}

function resolveIdUsuarioFromItem(it) {
  if (!it) return null;

  // vendas / vagas / notícias (idUsuario direto)
  if (it.idUsuario != null && typeof it.idUsuario === "object") {
    return normId(it.idUsuario.id);
  }
  if (it.idUsuario != null) {
    return normId(it.idUsuario);
  }

  // notícia em alguns formatos antigos
  if (it.autor?.id != null) {
    return normId(it.autor.id);
  }
  if (it.autorId != null) {
    return normId(it.autorId);
  }

  // doação em alguns formatos antigos
  if (it.doador?.id != null) {
    return normId(it.doador.id);
  }
  if (it.doadorId != null) {
    return normId(it.doadorId);
  }

  // genéricos
  if (it.usuario?.id != null) {
    return normId(it.usuario.id);
  }
  if (it.usuarioId != null) {
    return normId(it.usuarioId);
  }
  if (it.usuario_id != null) {
    return normId(it.usuario_id);
  }

  return null;
}

function temDonoDetectavel(it) {
  return resolveIdUsuarioFromItem(it) !== null;
}

export default function Perfil({ navigation }) {
  const { colors } = useRegionTheme();
  const accent = colors.primary;

  const [tab, setTab] = useState("noticias");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userId, setUserIdState] = useState(null);
  const [user, setUser] = useState(null);

  const [minhasNoticias, setMinhasNoticias] = useState([]);
  const [minhasDoacoes, setMinhasDoacoes] = useState([]);
  const [minhasVendas, setMinhasVendas] = useState([]);
  const [minhasVagas, setMinhasVagas] = useState([]);

  const [isFallbackNoticias, setIsFallbackNoticias] = useState(false);
  const [isFallbackDoacoes, setIsFallbackDoacoes] = useState(false);

  const logLista = (label, arr, uidNum) => {
    console.log(
      `👀 [Perfil] ${label} total=${arr.length} | uid=${uidNum}`,
      arr.slice(0, 3).map((x) => ({
        id: x.id,
        donoDetectado: resolveIdUsuarioFromItem(x),
        bruto_idUsuario: x.idUsuario,
        bruto_usuario: x.usuario,
        bruto_autor: x.autor,
        bruto_doador: x.doador,
      }))
    );
  };

  /* carrega dados do usuário */
  const loadUser = useCallback(async () => {
    console.log("🔎 [Perfil] loadUser() start");

    const uid = await getUserId();
    const uidNum = normId(uid);
    console.log("🔎 [Perfil] getUserId() ->", uid, "-> norm", uidNum);

    setUserIdState(uidNum);

    if (uidNum) {
      try {
        console.log("📤 [Perfil] GET /usuarios/listar/" + uidNum);
        const { data } = await api.get(`/usuarios/listar/${uidNum}`);
        console.log("✅ [Perfil] usuario carregado:", {
          id: data?.id,
          nome: data?.nome,
          fotoPerfil: data?.fotoPerfil,
        });
        setUser(data || null);
      } catch (e) {
        console.log("❌ [Perfil] erro carregando usuario:", e?.message || e);
        setUser(null);
      }
    } else {
      console.log("⚠️ [Perfil] sem uidNum, user=null");
      setUser(null);
    }
  }, []);

  /* carrega listas e aplica filtro */
  const loadLists = useCallback(async (uidNum) => {
    console.log("🔎 [Perfil] loadLists() uidNum=", uidNum);

    if (!uidNum) {
      console.log("⚠️ [Perfil] uidNum ausente, zerando listas");
      setMinhasNoticias([]);
      setMinhasDoacoes([]);
      setMinhasVendas([]);
      setMinhasVagas([]);
      setIsFallbackNoticias(false);
      setIsFallbackDoacoes(false);
      return;
    }

    const [n, d, v, g] = await Promise.allSettled([
      getTodasNoticias?.() ?? Promise.resolve([]),
      getTodasDoacoes?.() ?? Promise.resolve([]),
      getTodasVendas?.() ?? Promise.resolve([]),
      getTodasVagas?.() ?? Promise.resolve([]),
    ]);

    const arrN = Array.isArray(n?.value) ? n.value : [];
    const arrD = Array.isArray(d?.value) ? d.value : [];
    const arrV = Array.isArray(v?.value) ? v.value : [];
    const arrG = Array.isArray(g?.value) ? g.value : [];

    console.log("📦 [Perfil] listas brutas:");
    console.log("   Noticias[0..2]:", arrN.slice(0, 3));
    console.log("   Doacoes [0..2]:", arrD.slice(0, 3));
    console.log("   Vendas  [0..2]:", arrV.slice(0, 3));
    console.log("   Vagas   [0..2]:", arrG.slice(0, 3));
    console.log("   Totais =>", {
      noticias: arrN.length,
      doacoes: arrD.length,
      vendas: arrV.length,
      vagas: arrG.length,
    });

    function filtraSmart(lista, tipo) {
      if (!lista.length) {
        return { dados: [], fallback: false };
      }

      const alguemTemDono = lista.some((it) => temDonoDetectavel(it));

      if (!alguemTemDono) {
        console.log(
          `ℹ️ [Perfil] '${tipo}': nenhuma entrada tem idUsuario/dono. Vou mostrar TODAS nessa aba.`
        );
        return { dados: lista, fallback: true };
      }

      const minhas = lista.filter(
        (it) => resolveIdUsuarioFromItem(it) === uidNum
      );

      return { dados: minhas, fallback: false };
    }

    const noticiasCalc = filtraSmart(arrN, "noticias");
    const doacoesCalc = filtraSmart(arrD, "doacoes");

    const minhasVendasCalc = arrV.filter(
      (it) => resolveIdUsuarioFromItem(it) === uidNum
    );
    const minhasVagasCalc = arrG.filter(
      (it) => resolveIdUsuarioFromItem(it) === uidNum
    );

    logLista("minhasNoticias (final)", noticiasCalc.dados, uidNum);
    logLista("minhasDoacoes (final)", doacoesCalc.dados, uidNum);
    logLista("minhasVendas (final)", minhasVendasCalc, uidNum);
    logLista("minhasVagas (final)", minhasVagasCalc, uidNum);

    setMinhasNoticias(noticiasCalc.dados);
    setMinhasDoacoes(doacoesCalc.dados);
    setMinhasVendas(minhasVendasCalc);
    setMinhasVagas(minhasVagasCalc);

    setIsFallbackNoticias(noticiasCalc.fallback);
    setIsFallbackDoacoes(doacoesCalc.fallback);
  }, []);

  /* ciclo de carregamento inicial */
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      await loadUser();
      const uidRaw = await getUserId();
      const uidNum = normId(uidRaw);

      console.log(
        "🔁 [Perfil] depois loadUser(), uidRaw=",
        uidRaw,
        "uidNum=",
        uidNum
      );

      await loadLists(uidNum);
    } finally {
      setLoading(false);
    }
  }, [loadUser, loadLists]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const uidRaw = await getUserId();
      const uidNum = normId(uidRaw);
      console.log("🔄 [Perfil] refresh uidRaw=", uidRaw, "uidNum=", uidNum);

      await loadLists(uidNum);
      await loadUser();
    } finally {
      setRefreshing(false);
    }
  }, [loadLists, loadUser]);

  const nomeUsuario = useMemo(
    () => user?.nome || "Seu nome",
    [user?.nome]
  );
  const bioUsuario = useMemo(
    () =>
      user?.bio || "Perfil do autor. Edite sua bio para aparecer aqui.",
    [user?.bio]
  );

  const debugCounts = useMemo(() => {
    return (
      `uid=${userId} | ` +
      `N=${minhasNoticias.length}${isFallbackNoticias ? " (all)" : ""} ` +
      `D=${minhasDoacoes.length}${isFallbackDoacoes ? " (all)" : ""} ` +
      `V=${minhasVendas.length} ` +
      `G=${minhasVagas.length}`
    );
  }, [
    userId,
    minhasNoticias.length,
    minhasDoacoes.length,
    minhasVendas.length,
    minhasVagas.length,
    isFallbackNoticias,
    isFallbackDoacoes,
  ]);

  return (
    <View style={s.container}>
      <Header />

      <ScrollView
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[accent]}
            tintColor={accent}
          />
        }
      >
        {/* DEBUG STATUS NA TELA */}
        <Text
          style={{
            fontSize: 10,
            color: "#9CA3AF",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {debugCounts}
        </Text>

        {/* Banner / cabeçalho */}
        <View style={[s.headerCard, { borderColor: accent }]}>
          <View style={[s.avatarWrap, { borderColor: accent }]}>
            {user?.fotoPerfil ? (
              <Image source={{ uri: user.fotoPerfil }} style={s.avatar} />
            ) : (
              <View style={s.avatar}>
                <AvatarPlaceholder
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>
            )}
          </View>

          <View style={s.headerInfo}>
            <Text style={[s.userName, { color: accent }]} numberOfLines={1}>
              {nomeUsuario}
            </Text>
            <Text style={s.userBio} numberOfLines={2}>
              {bioUsuario}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditarPerfil")}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            style={[s.editBtn, { borderColor: accent }]}
          >
            <Ionicons name="create-outline" size={16} color={accent} />
          </TouchableOpacity>
        </View>

        {/* Abas */}
        <View style={s.tabsRow}>
          <TouchableOpacity
            onPress={() => setTab("noticias")}
            style={[
              s.tabBtn,
              tab === "noticias" && {
                borderBottomColor: accent,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Ionicons
              name="newspaper-outline"
              size={18}
              color={tab === "noticias" ? accent : "#94A3B8"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("doacoes")}
            style={[
              s.tabBtn,
              tab === "doacoes" && {
                borderBottomColor: accent,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Ionicons
              name="hand-left-outline"
              size={18}
              color={tab === "doacoes" ? accent : "#94A3B8"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("vendas")}
            style={[
              s.tabBtn,
              tab === "vendas" && {
                borderBottomColor: accent,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Ionicons
              name="storefront-outline"
              size={18}
              color={tab === "vendas" ? accent : "#94A3B8"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("vagas")}
            style={[
              s.tabBtn,
              tab === "vagas" && {
                borderBottomColor: accent,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Ionicons
              name="megaphone-outline"
              size={18}
              color={tab === "vagas" ? accent : "#94A3B8"}
            />
          </TouchableOpacity>
        </View>

        {/* Listagens */}
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="large" color={accent} />
          </View>
        ) : (
          <View style={s.cardsBlock}>
            {/* NOTÍCIAS */}
            {tab === "noticias" &&
              (minhasNoticias.length ? (
                minhasNoticias.map((n) => (
                  <View key={n.id} style={s.cardSpacer}>
                    <NewsCardItem
                      noticia={n}
                      onPress={() =>
                        navigation.navigate("DetalheNoticia", {
                          id: n.id,
                          noticia: n,
                        })
                      }
                    />
                  </View>
                ))
              ) : (
                !isFallbackNoticias && (
                  <Text style={s.emptyText}>
                    Você ainda não publicou notícias.
                  </Text>
                )
              ))}

            {/* DOAÇÕES */}
            {tab === "doacoes" &&
              (minhasDoacoes.length ? (
                minhasDoacoes.map((d) => (
                  <DoacaoCard
                    key={d.id}
                    item={d}
                    style={s.cardSpacer}
                    onPress={(selected) =>
                      navigation.navigate("DetalheDoacao", {
                        id: (selected && selected.id) || d.id,
                        doacao: selected || d,
                      })
                    }
                  />
                ))
              ) : (
                !isFallbackDoacoes && (
                  <Text style={s.emptyText}>
                    Você ainda não publicou doações.
                  </Text>
                )
              ))}

            {/* VENDAS */}
            {tab === "vendas" &&
              (minhasVendas.length ? (
                minhasVendas.map((v) => (
                  <VendaCard
                    key={v.id}
                    item={v}
                    style={s.cardSpacer}
                    onPress={() =>
                      navigation.navigate("DetalheVenda", {
                        id: v.id,
                        venda: v,
                      })
                    }
                  />
                ))
              ) : (
                <Text style={s.emptyText}>
                  Você ainda não publicou vendas.
                </Text>
              ))}

            {/* VAGAS */}
            {tab === "vagas" &&
              (minhasVagas.length ? (
                minhasVagas.map((vaga) => (
                  <VagaCard
                    key={vaga.id}
                    item={vaga}
                    style={s.cardSpacer}
                    onPress={() =>
                      navigation.navigate("DetalheVaga", {
                        id: vaga.id,
                        vaga,
                      })
                    }
                  />
                ))
              ) : (
                <Text style={s.emptyText}>
                  Você ainda não publicou vagas.
                </Text>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
