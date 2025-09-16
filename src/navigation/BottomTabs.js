import React from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NoticiasStack from "./NoticiasStack";
import DoacoesScreen from "../screens/doacoes/Doacoes.js";
import AchadinhosScreen from "../screens/achadinhos/Achadinhos.js";
import MaoAmigaScreen from "../screens/maoamiga/MaoAmiga.js";

import IconNews from "../assets/svgs/tab/Jornal.svg";
import IconHandHeart from "../assets/svgs/tab/MaoCoracao.svg";
import IconStore from "../assets/svgs/tab/Loja.svg";
import IconMegaphone from "../assets/svgs/tab/Megafone.svg";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  const ACTIVE = "#111";
  const INACTIVE = "#7C7C7C";
  const BG = "#fff";

  // Altura útil + área segura
  const baseHeight = 58;
  const totalHeight = baseHeight + Math.max(insets.bottom, 10);

  const SHADOW =
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: -2 } }
      : { elevation: 12 };

  return (
    <Tab.Navigator
      initialRouteName="NoticiasTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        // tela sem margens extras
        sceneContainerStyle: { backgroundColor: "transparent" },

        // ⬇️ Full-width, encostado em baixo
        tabBarStyle: [
          {
            position: "relative",          // participa do fluxo, não sobrepõe
            height: totalHeight,
            backgroundColor: BG,
            borderTopWidth: 0,
            borderRadius: 0,               // sem cantos – preenche de lado a lado
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12), // respeita safe area
          },
          SHADOW,
        ],

        tabBarItemStyle: { paddingVertical: 6 },

        // fundo padrão (sem bordas), mantém compatibilidade
        tabBarBackground: () => <View style={{ flex: 1 }} />,
      }}
    >
      <Tab.Screen
        name="NoticiasTab"
        component={NoticiasStack}
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
    </Tab.Navigator>
  );
}
