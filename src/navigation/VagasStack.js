import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Vagas from "../screens/vagas/Vagas";              
import DetalheVaga from "../screens/vagas/DetalheVaga";  
import NovaVaga from "../screens/vagas/NovaVaga";        

const Stack = createNativeStackNavigator();

export default function VagasStack() {
  return (
    <Stack.Navigator initialRouteName="VagasHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VagasHome" component={Vagas} />
      <Stack.Screen name="DetalheVaga" component={DetalheVaga} />
      <Stack.Screen name="NovaVaga" component={NovaVaga} />
    </Stack.Navigator>
  );
}
