import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login/Login";
import Cadastro from "../screens/login/Cadastro";
import EsqueciSenhaEmail from "../screens/login/EsqueciSenhaEmail";
import EsqueciSenhaCodigo from "../screens/login/EsqueciSenhaCodigo";
import BottomTabs from "./BottomTabs";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen
        name="EsqueciSenhaEmail"
        component={EsqueciSenhaEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EsqueciSenhaCodigo"
        component={EsqueciSenhaCodigo}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Noticias" component={BottomTabs} />
    </Stack.Navigator>
  );
}
