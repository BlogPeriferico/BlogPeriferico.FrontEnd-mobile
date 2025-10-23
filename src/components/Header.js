// src/components/Header.js
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/HeaderStyles";
import RegionSelector from "../components/RegionSelector";
import { useRegiao } from "../contexts/RegionContext";
import { useRegionTheme } from "../utils/regionTheme";
import { navigationRef /*, resetToMain*/ } from "../navigation/navigationRef"; // resetToMain opcional

const { width } = Dimensions.get("window");

// 🔎 mapeia telas de detalhe -> tela de lista alvo
const ROUTE_SEARCH_TARGETS = {
  DetalheNoticia: "NoticiasHome",
  DetalheDoacao: "DoacoesHome",
  DetalheVaga: "VagasHome",
};

// pega nome da rota atual
function getActiveRouteName() {
  try {
    if (!navigationRef?.isReady?.()) return null;
    const r = navigationRef.getCurrentRoute?.();
    return r?.name || null;
  } catch {
    return null;
  }
}

// 🚀 dispara a busca com base na rota atual
function dispatchSearch(query) {
  const q = String(query || "").trim();
  if (!q) return false;

  const current = getActiveRouteName();
  const target =
    ROUTE_SEARCH_TARGETS[current] || // se é detalhe, manda pra lista-mãe
    current ||                       // se já está numa lista, manda pra ela
    "NoticiasHome";                  // fallback

  const channel = `search:${target}`;
  DeviceEventEmitter.emit(channel, { q, from: current });
  DeviceEventEmitter.emit("app:search", { q, from: current });

  // (opcional) resetar aba:
  // try { resetToMain({ target }); } catch {}

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
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(menuAnim, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 220, useNativeDriver: false }),
    ]).start();
  };

  const fecharMenu = (cb) => {
    Animated.parallel([
      Animated.timing(menuAnim, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: -width, duration: 300, easing: Easing.in(Easing.cubic), useNativeDriver: false }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 180, useNativeDriver: false }),
    ]).start(() => {
      setMenuAberto(false);
      if (typeof cb === "function") cb();
    });
  };

  const toggleMenu = () => (menuAberto ? fecharMenu() : abrirMenu());

  // animações do ícone hambúrguer
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

  // abrir/fechar barra de busca
  const toggleBusca = (abrirExplícito) => {
    const abrir = typeof abrirExplícito === "boolean" ? abrirExplícito : !buscando;
    if (abrir === buscando) return;

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
    const ok = dispatchSearch(busca);
    if (ok) {
      // Se quiser fechar a barra após pesquisar:
      // toggleBusca(false);
      // inputRef.current?.blur();
    }
  };

  const limpar = () => {
    setBusca("");
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  // interação da lupa
  const onLupaPressIn = () => Animated.timing(lupaPress, { toValue: 1, duration: 80, useNativeDriver: false }).start();
  const onLupaPressOut = () =>
    Animated.timing(lupaPress, { toValue: 0, duration: 80, useNativeDriver: false }).start(() => {
      if (buscando) doSearch();      // quando já está aberta, tocar na lupa busca
      else toggleBusca(true);        // quando fechada, abre
    });

  const searchWidth = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width - 120] });
  const tituloOpacity = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const lupaRotate = searchAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] });
  const lupaScale = lupaPress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  const abrirSeletorRegiao = () => fecharMenu(() => setRegionVisible(true));
  const showClear = useMemo(() => buscando && busca.length > 0, [buscando, busca]);

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

          {/* Título + busca (originais) */}
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
                onSubmitEditing={doSearch}   // Enter dispara a busca
              />
              {showClear && (
                <TouchableOpacity onPress={limpar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Lupa (original) */}
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

              <Text style={styles.modalItem}>Perfil</Text>
              <Text style={styles.modalItem}>Notícias</Text>

              {/* ——— Somente o conteúdo do menu foi estilizado abaixo ——— */}
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

              <Text style={styles.modalItem}>Sair</Text>
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
