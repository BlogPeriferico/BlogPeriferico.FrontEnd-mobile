import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import News from "../screens/quebradainforma/Noticias";                   // sua lista + botão de adicionar
import NovaNoticia from "../screens/quebradainforma/NovaNoticia"; // tela de criação (multipart)
import DetalheNoticia from "../screens/quebradainforma/DetalheNoticia.js"; // placeholder de detalhe

const Stack = createNativeStackNavigator();

export default function NewsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewsHome" component={News} />
      <Stack.Screen name="NovaNoticia" component={NovaNoticia} />
      <Stack.Screen name="DetalheNoticia" component={DetalheNoticia} />
    </Stack.Navigator>
  );
}
