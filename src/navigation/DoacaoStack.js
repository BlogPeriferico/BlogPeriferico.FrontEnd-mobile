import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Doacoes from "../screens/doacoes/Doacoes";              
import DetalheDoacao from "../screens/doacoes/DetalheDoacao";  
import NovaDoacao from "../screens/doacoes/NovaDoacao";        

const Stack = createNativeStackNavigator();

export default function DoacaoStack() {
  return (
    <Stack.Navigator initialRouteName="DoacoesHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoacoesHome" component={Doacoes} />
      <Stack.Screen name="DetalheDoacao" component={DetalheDoacao} />
      <Stack.Screen name="NovaDoacao" component={NovaDoacao} />
    </Stack.Navigator>
  );
}
