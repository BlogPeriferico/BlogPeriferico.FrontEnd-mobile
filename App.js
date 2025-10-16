// App.js
import "react-native-gesture-handler";

import React from "react";
import { StatusBar, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import StackNavigator from "./src/navigation/StackNavigator";
import { RegionProvider } from "./src/contexts/RegionContext";

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function App() {
  return React.createElement(
    GestureHandlerRootView,
    { style: { flex: 1 } },
    React.createElement(
      SafeAreaProvider,
      null,
      React.createElement(
        RegionProvider,
        null,
        React.createElement(
          NavigationContainer,
          { theme: NavTheme },
          // StatusBar
          React.createElement(StatusBar, {
            translucent: true,
            backgroundColor: "transparent",
            barStyle: "light-content",
          }),
          // Navigator
          React.createElement(StackNavigator, null)
        )
      )
    )
  );
}
