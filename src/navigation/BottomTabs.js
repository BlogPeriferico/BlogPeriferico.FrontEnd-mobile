import React from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NoticiasScreen from "../screens/news/Noticias.js";
import DoacoesScreen from "../screens/doacoes/Doacoes.js";
import AchadinhosScreen from "../screens/achadinhos/Achadinhos.js";
import MaoAmigaScreen from "../screens/maoamiga/MaoAmiga.js";
import LandingScreen from "../screens/sobrenos/sobrenos.js"

import IconNews from "../assets/svgs/tab/Jornal.svg";
import IconHandHeart from "../assets/svgs/tab/MaoCoracao.svg";
import IconStore from "../assets/svgs/tab/Loja.svg";
import IconMegaphone from "../assets/svgs/tab/Megafone.svg";
import IconQuestion from "../assets/svgs/tab/interrogacao.svg"

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  const ACTIVE = "#111";
  const INACTIVE = "#7C7C7C";
  const BG = "#fff";

  // base visual
  const baseHeight = 58;

  // respiro extra além do safe-area (visual de “flutuando”)
  const bottomPadExtra = 12;

  // offset da barra em relação à borda inferior
  const bottomOffset = Math.max(insets.bottom, 8) + bottomPadExtra;

  // altura total da barra: base + parte do safe-area para não “comer” a borda arredondada
  const totalHeight = baseHeight + (insets.bottom > 0 ? insets.bottom : 10);

  const SHADOW =
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: -2 } }
      : { elevation: 24 };

  return (
    <Tab.Navigator
      initialRouteName="NoticiasTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        sceneContainerStyle: { backgroundColor: "transparent" },

        // 🔧 estilo da barra
        tabBarStyle: [
          {
            position: "absolute",
            left: 12,
            right: 12,
            bottom: bottomOffset,               // ⇦ mais afastada da borda
            height: totalHeight,                // ⇦ um pouco mais alta
            backgroundColor: BG,
            borderTopWidth: 0,
            borderRadius: 20,
            paddingHorizontal: 28,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12), // ⇦ garante “barriga” embaixo
            overflow: "visible",
          },
          SHADOW,
        ],

        // Área de toque confortável
        tabBarItemStyle: { paddingVertical: 6 },

        // (opcional) fundo custom para garantir anti-aliasing perfeito
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "transparent", borderRadius: 20 }} />
        ),
      }}
    >
      <Tab.Screen
        name="NoticiasTab"
        component={NoticiasScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconNews width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
      <Tab.Screen
        name="DoacoesTab"
        component={DoacoesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconHandHeart width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
      <Tab.Screen
        name="AchadinhosTab"
        component={AchadinhosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconStore width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
      <Tab.Screen
        name="MaoAmigaTab"
        component={MaoAmigaScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconMegaphone width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
      <Tab.Screen
        name="LandingTab"
        component={LandingScreen}
        options={{
        tabBarIcon: ({ focused }) => (
      <IconQuestion width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}
