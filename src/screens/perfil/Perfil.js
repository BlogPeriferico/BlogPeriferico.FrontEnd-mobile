import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
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

/* ===== CONFIG GRID (2 colunas para doações / vendas / vagas) ===== */
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 12; // mesmo paddingHorizontal do scrollContent
const GUTTER = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GUTTER) / 2;

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

  const totalPublicacoes = useMemo(
    () =>
      minhasNoticias.length +
      minhasDoacoes.length +
      minhasVendas.length +
      minhasVagas.length,
    [
      minhasNoticias.length,
      minhasDoacoes.length,
      minhasVendas.length,
      minhasVagas.length,
    ]
  );

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
        {/* HEADER ESTILO INSTAGRAM */}
        <View style={s.headerCard}>
          <View style={s.topRow}>
            <View style={s.avatarWrap}>
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

            {/* Métricas por tipo de publicação */}
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Text style={s.statNumber}>{minhasNoticias.length}</Text>
                <Text style={s.statLabel}>Notícias</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statNumber}>{minhasDoacoes.length}</Text>
                <Text style={s.statLabel}>Doações</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statNumber}>{minhasVendas.length}</Text>
                <Text style={s.statLabel}>Vendas</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statNumber}>{minhasVagas.length}</Text>
                <Text style={s.statLabel}>Vagas</Text>
              </View>
            </View>
          </View>

          <View style={s.nameBioBlock}>
            <Text style={s.userName}>{nomeUsuario}</Text>
            {!!bioUsuario && <Text style={s.userBio}>{bioUsuario}</Text>}
          </View>

          <View style={s.actionsRow}>
            <TouchableOpacity
              style={s.editProfileBtn}
              onPress={() => navigation.navigate("EditarPerfil")}
            >
              <Text style={s.editProfileText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Abas estilo Insta (só ícones) */}
        <View style={s.tabsRow}>
          <TouchableOpacity
            onPress={() => setTab("noticias")}
            style={[
              s.tabBtn,
              tab === "noticias" && [s.tabBtnActive, { borderBottomColor: accent }],
            ]}
          >
            <Ionicons
              name="grid-outline"
              size={22}
              color={tab === "noticias" ? accent : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("doacoes")}
            style={[
              s.tabBtn,
              tab === "doacoes" && [s.tabBtnActive, { borderBottomColor: accent }],
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={22}
              color={tab === "doacoes" ? accent : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("vendas")}
            style={[
              s.tabBtn,
              tab === "vendas" && [s.tabBtnActive, { borderBottomColor: accent }],
            ]}
          >
            <Ionicons
              name="pricetag-outline"
              size={22}
              color={tab === "vendas" ? accent : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("vagas")}
            style={[
              s.tabBtn,
              tab === "vagas" && [s.tabBtnActive, { borderBottomColor: accent }],
            ]}
          >
            <Ionicons
              name="briefcase-outline"
              size={22}
              color={tab === "vagas" ? accent : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo das abas */}
        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={accent} />
          </View>
        ) : (
          <View style={s.cardsBlock}>
            {/* NOTÍCIAS -> LISTA NORMAL, SEM GRID */}
            {tab === "noticias" &&
              (minhasNoticias.length ? (
                minhasNoticias.map((n) => (
                  <NewsCardItem
                    key={n.id}
                    noticia={n}
                    onPress={() =>
                      navigation.navigate("DetalheNoticia", {
                        id: n.id,
                        noticia: n,
                      })
                    }
                  />
                ))
              ) : (
                !isFallbackNoticias && (
                  <Text style={s.emptyText}>
                    Você ainda não publicou notícias.
                  </Text>
                )
              ))}

            {/* DOAÇÕES -> GRID 2 COLUNAS */}
            {tab === "doacoes" &&
              (minhasDoacoes.length ? (
                <View style={s.grid}>
                  {minhasDoacoes.map((d, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <DoacaoCard
                        key={d.id}
                        item={d}
                        style={[
                          s.cardGridItem,
                          {
                            width: CARD_W,
                            marginRight: isLeftCol ? GUTTER : 0,
                          },
                        ]}
                        onPress={(selected) =>
                          navigation.navigate("DetalheDoacao", {
                            id: (selected && selected.id) || d.id,
                            doacao: selected || d,
                          })
                        }
                      />
                    );
                  })}
                </View>
              ) : (
                !isFallbackDoacoes && (
                  <Text style={s.emptyText}>
                    Você ainda não publicou doações.
                  </Text>
                )
              ))}

            {/* VENDAS -> GRID 2 COLUNAS */}
            {tab === "vendas" &&
              (minhasVendas.length ? (
                <View style={s.grid}>
                  {minhasVendas.map((v, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <VendaCard
                        key={v.id}
                        item={v}
                        style={[
                          s.cardGridItem,
                          {
                            width: CARD_W,
                            marginRight: isLeftCol ? GUTTER : 0,
                          },
                        ]}
                        onPress={() =>
                          navigation.navigate("DetalheVenda", {
                            id: v.id,
                            venda: v,
                          })
                        }
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={s.emptyText}>
                  Você ainda não publicou vendas.
                </Text>
              ))}

            {/* VAGAS -> GRID 2 COLUNAS */}
            {tab === "vagas" &&
              (minhasVagas.length ? (
                <View style={s.grid}>
                  {minhasVagas.map((vaga, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <VagaCard
                        key={vaga.id}
                        item={vaga}
                        style={[
                          s.cardGridItem,
                          {
                            width: CARD_W,
                            marginRight: isLeftCol ? GUTTER : 0,
                          },
                        ]}
                        onPress={() =>
                          navigation.navigate("DetalheVaga", {
                            id: vaga.id,
                            vaga,
                          })
                        }
                      />
                    );
                  })}
                </View>
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
