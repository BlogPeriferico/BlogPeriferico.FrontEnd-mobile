import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login/Login";
import Cadastro from "../screens/login/Cadastro";
import EsqueciSenhaEmail from "../screens/login/EsqueciSenhaEmail";
import EsqueciSenhaCodigo from "../screens/login/EsqueciSenhaCodigo";
import BottomTabs from "./BottomTabs";
import PerfilStack from "./PerfilStack"; // ⬅️ ADICIONE

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="EsqueciSenhaEmail" component={EsqueciSenhaEmail} />
      <Stack.Screen name="EsqueciSenhaCodigo" component={EsqueciSenhaCodigo} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="Perfil" component={PerfilStack} />
    </Stack.Navigator>
  );
}
