import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  Platform,
  DeviceEventEmitter,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/components/HeaderStyles";
import RegionSelector from "../components/RegionSelector";
import { useRegiao } from "../contexts/RegionContext";
import { useRegionTheme } from "../utils/regionTheme";
import { navigationRef } from "../navigation/navigationRef";
import { TOKEN_KEY } from "../services/tokenStore";
import api from "../services/api";
import { getUserId } from "../services/auth";

const { width } = Dimensions.get("window");
const dbg = (...a) => console.log("🧱[Header]", ...a);

/**
 * 🔧 NOMES DAS ROTAS
 *  - Stack raiz (StackNavigator): Main, Perfil
 *  - Tabs dentro de Main: NoticiasTab, DoacoesTab, VendasTab, MaoAmigaTab, SobreTab
 */
const ROOT_ROUTES = {
  MAIN: "Main",
  PERFIL: "Perfil",
};

const TAB_ROUTES = {
  NOTICIAS: "NoticiasTab",
  DOACOES: "DoacoesTab",
  VENDAS: "VendasTab",
  VAGAS: "MaoAmigaTab",
  SOBRE: "SobreTab",
};

/**
 * Para o sistema de busca (emit por DeviceEventEmitter)
 */
const ROUTE_SEARCH_TARGETS = {
  DetalheNoticia: "NoticiasHome",
  DetalheDoacao: "DoacoesHome",
  DetalheVaga: "VagasHome",
  DetalheVenda: "VendasHome",
};

function getActiveRouteNameSafe() {
  try {
    if (!navigationRef?.isReady?.()) return null;
    const r = navigationRef.getCurrentRoute?.();
    return r?.name || null;
  } catch {
    return null;
  }
}

function dispatchSearch(query) {
  const q = String(query || "").trim();
  if (!q) return false;

  const current = getActiveRouteNameSafe();
  const target = ROUTE_SEARCH_TARGETS[current] || current || "NoticiasHome";
  const channel = `search:${target}`;

  dbg("dispatchSearch ->", { q, current, target, channel });

  DeviceEventEmitter.emit(channel, { q, from: current });
  DeviceEventEmitter.emit("app:search", { q, from: current });

  return true;
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState("");

  const [regionVisible, setRegionVisible] = useState(false);

  const { colors } = useRegionTheme();
  const { regiao } = useRegiao?.() ?? { regiao: "centro" };

  const menuAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const lupaPress = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // ====== USUÁRIO (nome, email, foto) ======
  const [user, setUser] = useState(null);

  useEffect(() => {
    let live = true;

    (async () => {
      try {
        const uid = await getUserId();
        if (!uid) {
          dbg("⚠️[Header] sem uid, não carrego usuário");
          return;
        }

        dbg("📤[Header] GET /usuarios/listar/", uid);
        const { data } = await api.get(`/usuarios/listar/${uid}`);
        if (!live) return;

        dbg("✅[Header] usuario:", {
          id: data?.id,
          nome: data?.nome,
          fotoPerfil: data?.fotoPerfil,
        });
        setUser(data || null);
      } catch (e) {
        dbg("❌[Header] erro carregando usuario:", e?.message || e);
        setUser(null);
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  const userName = user?.nome || "BlogPeriférico";
  const userSubtitle = user?.email || "Seu corre, sua voz na quebrada";

  /* ============== DERIVADOS ANIMADOS ============== */

  // barrinha colorida embaixo do header "respirando" com o menu
  const accentScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  // titulo dá uma leve encolhida quando a busca abre
  const titleScale = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  // caixa de busca com fundo / borda animados
  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120],
  });

  const tituloOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchBorderColor = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(148,163,184,0)", "rgba(148,163,184,1)"], // slate-400
  });

  const searchBgColor = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F3F4F6", "#EEF2FF"], // cinza -> lilás claro
  });

  const lupaRotate = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const lupaScale = lupaPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const showClear = useMemo(
    () => buscando && busca.length > 0,
    [buscando, busca]
  );

  /* ============== MENU LATERAL ============== */

  const abrirMenu = () => {
    dbg("abrirMenu()");
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const fecharMenu = (cb) => {
    dbg("fecharMenu()");
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setMenuAberto(false);
      if (typeof cb === "function") cb();
    });
  };

  const toggleMenu = () => {
    dbg("toggleMenu()", { aberto: menuAberto });
    menuAberto ? fecharMenu() : abrirMenu();
  };

  const topBar = {
    transform: [
      {
        translateY: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-6, 0],
        }),
      },
      {
        rotate: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const midBar = {
    opacity: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scaleX: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.2],
        }),
      },
    ],
  };

  const botBar = {
    transform: [
      {
        translateY: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [6, 0],
        }),
      },
      {
        rotate: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-45deg"],
        }),
      },
    ],
  };

  /* ============== BUSCA ============== */

  const toggleBusca = (abrirExplícito) => {
    const abrir =
      typeof abrirExplícito === "boolean" ? abrirExplícito : !buscando;
    if (abrir === buscando) return;

    dbg("toggleBusca()", { abrir, buscando });

    if (abrir) setBuscando(true);

    Animated.timing(searchAnim, {
      toValue: abrir ? 1 : 0,
      duration: abrir ? 320 : 260,
      easing: abrir ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      if (abrir) inputRef.current?.focus();
      else setBuscando(false);
    });
  };

  const doSearch = () => {
    dbg("doSearch()", { query: busca });
    const ok = dispatchSearch(busca);
    dbg("doSearch result:", ok);
  };

  const limpar = () => {
    dbg("limpar busca");
    setBusca("");
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  const onLupaPressIn = () =>
    Animated.timing(lupaPress, {
      toValue: 1,
      duration: 80,
      useNativeDriver: false,
    }).start();

  const onLupaPressOut = () =>
    Animated.timing(lupaPress, {
      toValue: 0,
      duration: 80,
      useNativeDriver: false,
    }).start(() => {
      if (buscando) doSearch();
      else toggleBusca(true);
    });

  /* ============== NAVEGAÇÃO (ROOT + TABS) ============== */

  const goPerfil = () => {
    try {
      dbg("navigate -> Perfil (stack raiz)");
      navigationRef?.navigate?.(ROOT_ROUTES.PERFIL);
    } catch (e) {
      dbg("ERRO navigate Perfil:", e?.message || e);
    }
  };

  const goTab = (tabName) => {
    try {
      dbg("navigate -> Main ->", tabName);
      navigationRef?.navigate?.(ROOT_ROUTES.MAIN, {
        screen: tabName,
      });
    } catch (e) {
      dbg("ERRO navigate tab:", e?.message || e);
    }
  };

  const abrirSeletorRegiao = () => {
    dbg("abrirSeletorRegiao()");
    fecharMenu(() => setRegionVisible(true));
  };

  /* ============== LOGOUT ============== */

  const handleLogout = async () => {
    try {
      fecharMenu();

      const candidates = [
        TOKEN_KEY || "auth_token",
        "USER_ID_KEY",
        "user_id",
        "auth:token",
      ];

      await Promise.all(
        candidates.map((k) => AsyncStorage.removeItem(k).catch(() => {}))
      );

      DeviceEventEmitter.emit("auth:logout");

      navigationRef?.reset?.({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("⚠️[Header] logout erro:", e?.message || e);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  /* ============== RENDER ============== */

  // iniciais de fallback p/ avatar
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "BP";

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.statusbarBackground}>
        {Platform.OS === "android" && <View style={styles.statusBarSpacer} />}
        <SafeAreaView style={styles.safeAreaTopIOS} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.headerContainer}>
          {/* Botão hambúrguer */}
          <TouchableOpacity activeOpacity={0.9} onPress={toggleMenu}>
            <Animated.View
              style={[
                styles.hamburguer,
                {
                  transform: [
                    {
                      scale: menuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View style={[styles.hBar, topBar]} />
              <Animated.View style={[styles.hBar, midBar]} />
              <Animated.View style={[styles.hBar, botBar]} />
            </Animated.View>
          </TouchableOpacity>

          {/* Título + busca */}
          <View style={styles.centerArea}>
            <Animated.Text
              style={[
                styles.titulo,
                {
                  opacity: tituloOpacity,
                  color: colors.primary,
                  transform: [{ scale: titleScale }],
                },
              ]}
            >
              BlogPeriférico
            </Animated.Text>

            <Animated.View
              style={[
                styles.searchBox,
                {
                  width: searchWidth,
                  opacity: searchAnim,
                  borderColor: searchBorderColor,
                  backgroundColor: searchBgColor,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#9CA3AF"
                style={{ marginRight: 6 }}
              />
              <TextInput
                ref={inputRef}
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar na quebrada..."
                placeholderTextColor="#6B7280"
                style={styles.inputBusca}
                returnKeyType="search"
                blurOnSubmit
                onSubmitEditing={doSearch}
              />
              {showClear && (
                <TouchableOpacity
                  onPress={limpar}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.clearBtn}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Lupa externa */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={onLupaPressIn}
            onPressOut={onLupaPressOut}
          >
            <Animated.View
              style={{
                transform: [{ rotate: lupaRotate }, { scale: lupaScale }],
              }}
            >
              <Ionicons name="search" size={24} color={colors.primary} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Barrinha colorida embaixo do header */}
        <View style={styles.headerAccentWrapper}>
          <Animated.View
            style={[
              styles.headerAccentBar,
              {
                backgroundColor: colors.primary,
                transform: [{ scaleX: accentScale }],
              },
            ]}
          />
        </View>
      </SafeAreaView>

      {/* MENU LATERAL */}
      {menuAberto && (
        <View style={styles.fullscreenModal} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.modalLateral,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Botão fechar */}
            <Pressable style={styles.botaoFechar} onPress={() => fecharMenu()}>
              <View style={styles.hamburguer}>
                <Animated.View style={[styles.hBar, topBar]} />
                <Animated.View style={[styles.hBar, midBar]} />
                <Animated.View style={[styles.hBar, botBar]} />
              </View>
            </Pressable>

            {/* Headerzinho do drawer com usuário */}
            <View style={styles.drawerHeader}>
              {user?.fotoPerfil ? (
                <Image
                  source={{ uri: user.fotoPerfil }}
                  style={styles.drawerAvatarImage}
                />
              ) : (
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.drawerHeaderTextWrap}>
                <Text style={styles.drawerHeaderTitle}>{userName}</Text>
                <Text style={styles.drawerHeaderSubtitle}>
                  {userSubtitle}
                </Text>
              </View>
            </View>

            {/* Itens do menu com ícones */}
            <TouchableOpacity
              onPress={() => fecharMenu(() => goPerfil())}
              activeOpacity={0.85}
              style={styles.drawerItemRow}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color="#111827"
                />
                <Text style={styles.drawerItemLabel}>Perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fecharMenu(() => goTab(TAB_ROUTES.NOTICIAS))}
              activeOpacity={0.85}
              style={styles.drawerItemRow}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons name="newspaper-outline" size={20} color="#111827" />
                <Text style={styles.drawerItemLabel}>Notícias</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fecharMenu(() => goTab(TAB_ROUTES.DOACOES))}
              activeOpacity={0.85}
              style={styles.drawerItemRow}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons name="heart-outline" size={20} color="#111827" />
                <Text style={styles.drawerItemLabel}>Doações</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fecharMenu(() => goTab(TAB_ROUTES.VENDAS))}
              activeOpacity={0.85}
              style={styles.drawerItemRow}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons
                  name="storefront-outline"
                  size={20}
                  color="#111827"
                />
                <Text style={styles.drawerItemLabel}>Vendas</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fecharMenu(() => goTab(TAB_ROUTES.VAGAS))}
              activeOpacity={0.85}
              style={styles.drawerItemRow}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons name="briefcase-outline" size={20} color="#111827" />
                <Text style={styles.drawerItemLabel}>Vagas</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Seção de região */}
            <Text style={styles.drawerSectionTitle}>Localização</Text>

            <TouchableOpacity
              onPress={abrirSeletorRegiao}
              activeOpacity={0.9}
              style={{ marginTop: 8 }}
            >
              <View style={styles.drawerRegionButton}>
                <View style={styles.drawerRegionLeft}>
                  <View style={styles.drawerRegionIconWrap}>
                    <Ionicons name="map-outline" size={18} color="#3949AB" />
                  </View>
                  <Text style={styles.drawerRegionLabel}>
                    Escolher região
                  </Text>
                </View>

                <View style={styles.drawerRegionRight}>
                  <View style={styles.drawerRegionChip}>
                    <Text style={styles.drawerRegionChipText}>
                      {String(regiao || "")
                        .replace("noroeste2", "noroeste (2)")
                        .replace(/^./, (c) => c.toUpperCase())}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                    style={styles.drawerChevron}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            {/* Sair */}
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.85}
              style={[styles.drawerItemRow, { marginTop: 8 }]}
            >
              <View style={styles.drawerItemLeft}>
                <Ionicons name="log-out-outline" size={20} color="#B00020" />
                <Text
                  style={[
                    styles.drawerItemLabel,
                    { color: "#B00020", fontWeight: "700" },
                  ]}
                >
                  Sair
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.modalOverlay, { opacity: overlayAnim }]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => fecharMenu()} />
          </Animated.View>
        </View>
      )}

      {/* Modal de regiões */}
      <RegionSelector
        visible={regionVisible}
        onClose={() => setRegionVisible(false)}
      />
    </>
  );
}
