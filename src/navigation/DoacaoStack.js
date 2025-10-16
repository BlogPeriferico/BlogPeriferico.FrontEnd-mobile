import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Doacoes from "../screens/doacoes/Doacoes";
import NovaDoacao from "../screens/doacoes/NovaDoacao";
const Stack = createNativeStackNavigator();

export default function DoacaoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Doacoes" component={Doacoes} />
      <Stack.Screen name="NovaDoacao" component={NovaDoacao} />
    </Stack.Navigator>
  );
}
