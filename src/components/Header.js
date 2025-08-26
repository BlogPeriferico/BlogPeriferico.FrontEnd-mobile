import React, { useRef, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/HeaderStyles";

const { width } = Dimensions.get("window");

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState("");

  // Animated Values
  const menuAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const lupaPress = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // ===== MENU =====
  const abrirMenu = () => {
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

  const fecharMenu = () => {
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
    ]).start(() => setMenuAberto(false));
  };

  const toggleMenu = () => (menuAberto ? fecharMenu() : abrirMenu());

  // barras do hambúrguer -> X
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

  // ===== BUSCA / LUPA =====
  const toggleBusca = () => {
    const abrir = !buscando;
    setBuscando(true);
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

  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120],
  });
  const tituloOpacity = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const lupaRotate = searchAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] });
  const lupaScale = lupaPress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  const onLupaPressIn = () => {
    Animated.timing(lupaPress, { toValue: 1, duration: 80, useNativeDriver: false }).start();
  };
  const onLupaPressOut = () => {
    Animated.timing(lupaPress, { toValue: 0, duration: 80, useNativeDriver: false }).start(
      () => toggleBusca()
    );
  };

  return (
    <>
      {/* StatusBar translúcida para permitir ocupar a área, 
          mas com preenchimento branco por trás */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.statusbarBackground}>
        {/* ANDROID: spacer branco do tamanho da status bar */}
        {Platform.OS === "android" && <View style={styles.statusBarSpacer} />}

        {/* iOS: SafeAreaView pinta o topo (notch) de branco */}
        <SafeAreaView style={styles.safeAreaTopIOS} />
      </View>

      {/* Header em si */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Hamburguer animado */}
          <TouchableOpacity activeOpacity={0.85} onPress={toggleMenu}>
            <View style={styles.hamburguer}>
              <Animated.View style={[styles.hBar, topBar]} />
              <Animated.View style={[styles.hBar, midBar]} />
              <Animated.View style={[styles.hBar, botBar]} />
            </View>
          </TouchableOpacity>

          {/* Título / Busca */}
          <View style={styles.centerArea}>
            <Animated.Text style={[styles.titulo, { opacity: tituloOpacity }]}>
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
              />
            </Animated.View>
          </View>

          {/* Lupa */}
          <TouchableOpacity activeOpacity={0.9} onPressIn={onLupaPressIn} onPressOut={onLupaPressOut}>
            <Animated.View style={{ transform: [{ rotate: lupaRotate }, { scale: lupaScale }] }}>
              <Ionicons name="search" size={24} color="#001C30" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Drawer + overlay (fora do topo branco para cobrir a tela toda) */}
        {menuAberto && (
          <View style={styles.fullscreenModal} pointerEvents="box-none">
            <Animated.View style={[styles.modalLateral, { transform: [{ translateX: slideAnim }] }]}>
              <Pressable style={styles.botaoFechar} onPress={fecharMenu}>
                <View style={styles.hamburguer}>
                  <Animated.View style={[styles.hBar, topBar]} />
                  <Animated.View style={[styles.hBar, midBar]} />
                  <Animated.View style={[styles.hBar, botBar]} />
                </View>
              </Pressable>

              <Text style={styles.modalItem}>Perfil</Text>
              <Text style={styles.modalItem}>Notícias</Text>
              <Text style={styles.modalItem}>Sair</Text>
            </Animated.View>

            <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
              <Pressable style={{ flex: 1 }} onPress={fecharMenu} />
            </Animated.View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
