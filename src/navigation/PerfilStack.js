import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Perfil from "../screens/perfil/Perfil";

const dbg = (...a) => console.log("🧭[PerfilStack]", ...a);

const Stack = createNativeStackNavigator();

export default function PerfilStack() {
  useEffect(() => {
    dbg("MOUNT");
    return () => dbg("UNMOUNT");
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PerfilHome"
        component={Perfil}
        options={{ animation: "slide_from_right" }}
      />
      {/*
        Caso adicione a tela de edição:
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      */}
    </Stack.Navigator>
  );
}
