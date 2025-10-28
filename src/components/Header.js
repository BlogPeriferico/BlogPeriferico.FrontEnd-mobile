import React, { useRef, useState, useMemo } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/HeaderStyles";
import RegionSelector from "../components/RegionSelector";
import { useRegiao } from "../contexts/RegionContext";
import { useRegionTheme } from "../utils/regionTheme";
import { navigationRef } from "../navigation/navigationRef";
import { TOKEN_KEY } from "../services/tokenStore"; 

const { width } = Dimensions.get("window");
const dbg = (...a) => console.log("🧱[Header]", ...a);

const ROUTE_SEARCH_TARGETS = {
  DetalheNoticia: "NoticiasHome",
  DetalheDoacao: "DoacoesHome",
  DetalheVaga: "VagasHome",
  DetalheVenda: "VendasHome",
};

function getActiveRouteName() {
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
  const current = getActiveRouteName();
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

  const { colors } = useRegionTheme();
  const { regiao } = useRegiao?.() ?? { regiao: "centro" };

  const [regionVisible, setRegionVisible] = useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const lupaPress = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  const abrirMenu = () => {
    dbg("abrirMenu()");
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(menuAnim, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 220, useNativeDriver: false }),
    ]).start();
  };

  const fecharMenu = (cb) => {
    dbg("fecharMenu()");
    Animated.parallel([
      Animated.timing(menuAnim, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: -width, duration: 300, easing: Easing.in(Easing.cubic), useNativeDriver: false }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 180, useNativeDriver: false }),
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
      { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
      { rotate: menuAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) },
    ],
  };
  const midBar = {
    opacity: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{ scaleX: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) }],
  };
  const botBar = {
    transform: [
      { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
      { rotate: menuAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-45deg"] }) },
    ],
  };

  const toggleBusca = (abrirExplícito) => {
    const abrir = typeof abrirExplícito === "boolean" ? abrirExplícito : !buscando;
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
    Animated.timing(lupaPress, { toValue: 1, duration: 80, useNativeDriver: false }).start();

  const onLupaPressOut = () =>
    Animated.timing(lupaPress, { toValue: 0, duration: 80, useNativeDriver: false }).start(() => {
      if (buscando) doSearch();
      else toggleBusca(true);
    });

  const searchWidth = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width - 120] });
  const tituloOpacity = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const lupaRotate = searchAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] });
  const lupaScale = lupaPress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  const abrirSeletorRegiao = () => {
    dbg("abrirSeletorRegiao()");
    fecharMenu(() => setRegionVisible(true));
  };

  const showClear = useMemo(() => buscando && busca.length > 0, [buscando, busca]);

  const go = (routeName) => {
    try {
      dbg("navigate ->", routeName);
      navigationRef?.navigate?.(routeName);
    } catch (e) {
      dbg("ERRO navigate:", e?.message || e);
    }
  };

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
        candidates.map((k) =>
          AsyncStorage.removeItem(k).catch(() => {})
        )
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

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.statusbarBackground}>
        {Platform.OS === "android" && <View style={styles.statusBarSpacer} />}
        <SafeAreaView style={styles.safeAreaTopIOS} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Hambúrguer */}
          <TouchableOpacity activeOpacity={0.85} onPress={toggleMenu}>
            <View style={styles.hamburguer}>
              <Animated.View style={[styles.hBar, topBar]} />
              <Animated.View style={[styles.hBar, midBar]} />
              <Animated.View style={[styles.hBar, botBar]} />
            </View>
          </TouchableOpacity>

          {/* Título + busca */}
          <View style={styles.centerArea}>
            <Animated.Text style={[styles.titulo, { opacity: tituloOpacity, color: colors.primary }]}>
              BlogPeriferico
            </Animated.Text>

            <Animated.View style={[styles.searchBox, { width: searchWidth, opacity: searchAnim }]}>
              <TextInput
                ref={inputRef}
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar..."
                placeholderTextColor="#555"
                style={styles.inputBusca}
                returnKeyType="search"
                blurOnSubmit
                onSubmitEditing={doSearch}
              />
              {showClear && (
                <TouchableOpacity
                  onPress={limpar}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Lupa */}
          <TouchableOpacity activeOpacity={0.9} onPressIn={onLupaPressIn} onPressOut={onLupaPressOut}>
            <Animated.View style={{ transform: [{ rotate: lupaRotate }, { scale: lupaScale }] }}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* MENU LATERAL */}
        {menuAberto && (
          <View style={styles.fullscreenModal} pointerEvents="box-none">
            <Animated.View style={[styles.modalLateral, { transform: [{ translateX: slideAnim }] }]}>
              <Pressable style={styles.botaoFechar} onPress={() => fecharMenu()}>
                <View style={styles.hamburguer}>
                  <Animated.View style={[styles.hBar, topBar]} />
                  <Animated.View style={[styles.hBar, midBar]} />
                  <Animated.View style={[styles.hBar, botBar]} />
                </View>
              </Pressable>

              {/* Itens do menu com navegação */}
              <TouchableOpacity onPress={() => fecharMenu(() => go("Perfil"))}>
                <Text style={styles.modalItem}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fecharMenu(() => go("NoticiasTab"))}>
                <Text style={styles.modalItem}>Notícias</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fecharMenu(() => go("DoacoesTab"))}>
                <Text style={styles.modalItem}>Doações</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fecharMenu(() => go("VendasTab"))}>
                <Text style={styles.modalItem}>Vendas</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fecharMenu(() => go("MaoAmigaTab"))}>
                <Text style={styles.modalItem}>Vagas</Text>
              </TouchableOpacity>

              {/* Seção de região */}
              <Text style={styles.drawerSectionTitle}>Localização</Text>

              <TouchableOpacity onPress={abrirSeletorRegiao} activeOpacity={0.9} style={{ marginTop: 8 }}>
                <View style={styles.drawerRegionButton}>
                  <View style={styles.drawerRegionLeft}>
                    <View style={styles.drawerRegionIconWrap}>
                      <Ionicons name="map-outline" size={18} color="#3949AB" />
                    </View>
                    <Text style={styles.drawerRegionLabel}>Escolher região</Text>
                  </View>

                  <View style={styles.drawerRegionRight}>
                    <View style={styles.drawerRegionChip}>
                      <Text style={styles.drawerRegionChipText}>
                        {String(regiao || "")
                          .replace("noroeste2", "noroeste (2)")
                          .replace(/^./, (c) => c.toUpperCase())}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={styles.drawerChevron} />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              {/* deslogar */}
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.modalItem, { color: "#B00020" }]}>Sair</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
              <Pressable style={{ flex: 1 }} onPress={() => fecharMenu()} />
            </Animated.View>
          </View>
        )}
      </SafeAreaView>

      {/* Modal de regiões */}
      <RegionSelector visible={regionVisible} onClose={() => setRegionVisible(false)} />
    </>
  );
}
