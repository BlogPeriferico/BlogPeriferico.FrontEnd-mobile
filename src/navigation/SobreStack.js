import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SobreScreen from "../screens/sobre/Sobre";

const Stack = createNativeStackNavigator();

export default function SobreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sobre" component={SobreScreen} />
    </Stack.Navigator>
  );
}
