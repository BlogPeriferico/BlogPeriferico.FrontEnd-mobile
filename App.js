import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";

import { RegionProvider } from "./src/contexts/RegionContext";

export default function App() {
  return (
    <RegionProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </RegionProvider>
  );
}
