// src/routes/BottomTabs.jsx
import React from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NoticiasStack from "./NoticiasStack";
import DoacaoStack from "./DoacaoStack";
import VagasStack from "./VagasStack";
import SobreStack from "./SobreStack";

import AchadinhosScreen from "../screens/achadinhos/Achadinhos";

import IconNews from "../assets/svgs/tab/Jornal.svg";
import IconHandHeart from "../assets/svgs/tab/MaoCoracao.svg";
import IconStore from "../assets/svgs/tab/Loja.svg";
import IconMegaphone from "../assets/svgs/tab/Megafone.svg";
import IconQuestion from "../assets/svgs/tab/Interrogacao.svg"; 

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  const ACTIVE = "#111";
  const INACTIVE = "#7C7C7C";
  const BG = "#fff";
  const baseHeight = 58;

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
        sceneContainerStyle: { backgroundColor: "transparent" },
        tabBarStyle: [
          {
            position: "relative",
            height: baseHeight + Math.max(insets.bottom, 12),
            backgroundColor: BG,
            borderTopWidth: 0,
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12),
          },
          SHADOW,
        ],
        tabBarItemStyle: { paddingVertical: 6 },
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
        component={DoacaoStack}
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
        component={VagasStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconMegaphone width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />

      {/* SOBRE */}
      <Tab.Screen
        name="SobreTab"
        component={SobreStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconQuestion width={28} height={28} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
