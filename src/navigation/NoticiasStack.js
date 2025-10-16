import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Noticias from "../screens/quebradainforma/Noticias";
import NovaNoticia from "../screens/quebradainforma/NovaNoticia";
import DetalheNoticia from "../screens/quebradainforma/DetalheNoticia";

const Stack = createNativeStackNavigator();

export default function NoticiasStack() {
  return (
    <Stack.Navigator initialRouteName="NoticiasHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NoticiasHome" component={Noticias} />
      <Stack.Screen name="NovaNoticia" component={NovaNoticia} />
      <Stack.Screen name="DetalheNoticia" component={DetalheNoticia} />
    </Stack.Navigator>
  );
}
