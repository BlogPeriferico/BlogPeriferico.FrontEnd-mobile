import "react-native-gesture-handler";
import React from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import StackNavigator from "./src/navigation/StackNavigator";
import { RegionProvider } from "./src/contexts/RegionContext";
import { navigationRef } from "./src/navigation/navigationRef";

import {
  useFonts as usePoppinsFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

import {
  useFonts as useFrauncesFonts,
  Fraunces_300Light,
  Fraunces_500Medium,
} from "@expo-google-fonts/fraunces";

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function App() {
  const [pLoaded] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [fLoaded] = useFrauncesFonts({
    Fraunces_300Light,
    Fraunces_500Medium,
  });

  const loaded = pLoaded && fLoaded;

  if (!loaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <ActivityIndicator size="large" color="#000" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RegionProvider>
          <NavigationContainer theme={NavTheme} ref={navigationRef}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <StackNavigator />
          </NavigationContainer>
        </RegionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
