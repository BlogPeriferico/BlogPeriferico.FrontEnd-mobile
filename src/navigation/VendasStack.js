import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Vendas from "../screens/vendas/Vendas";           
import DetalheVenda from "../screens/vendas/DetalheVenda"; 
import NovaVenda from "../screens/vendas/NovaVenda";       

const Stack = createNativeStackNavigator();

export default function VendasStack() {
  return (
    <Stack.Navigator initialRouteName="VendasHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VendasHome" component={Vendas} />
      <Stack.Screen name="DetalheVenda" component={DetalheVenda} />
      <Stack.Screen name="NovaVenda" component={NovaVenda} />
    </Stack.Navigator>
  );
}
