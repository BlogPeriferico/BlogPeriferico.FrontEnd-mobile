// 👇 precisa ser a primeira linha do app (antes de qualquer import que use navegação)
import "react-native-gesture-handler";

import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import StackNavigator from "./src/navigation/StackNavigator";
import { RegionProvider } from "./src/contexts/RegionContext";

// Tema para evitar flash branco quando suas telas usam ImageBackground
const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RegionProvider>
          <NavigationContainer theme={NavTheme}>
            {/* StatusBar: ajuste a cor conforme seu layout (claro/escuro) */}
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <StackNavigator />
          </NavigationContainer>
        </RegionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
