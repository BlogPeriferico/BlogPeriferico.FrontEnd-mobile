// src/navigation/PerfilStack.js
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Perfil from "../screens/perfil/Perfil";
import EditarPerfil from "../screens/perfil/EditarPerfil"; // ⬅️ ADICIONADO

// TELAS DE LISTA
import Noticias from "../screens/quebradainforma/Noticias";
import Doacoes from "../screens/doacoes/Doacoes";
import Vendas from "../screens/vendas/Vendas";
import Vagas from "../screens/vagas/Vagas";

// TELAS DE DETALHE
import DetalheNoticia from "../screens/quebradainforma/DetalheNoticia";
import DetalheDoacao from "../screens/doacoes/DetalheDoacao";
import DetalheVenda from "../screens/vendas/DetalheVenda";
import DetalheVaga from "../screens/vagas/DetalheVaga";

const dbg = (...a) => console.log("🧭[PerfilStack]", ...a);

const Stack = createNativeStackNavigator();

export default function PerfilStack() {
  useEffect(() => {
    dbg("MOUNT");
    return () => dbg("UNMOUNT");
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="PerfilHome"
      screenOptions={{ headerShown: false }}
    >
      {/* Tela principal do perfil */}
      <Stack.Screen
        name="PerfilHome"
        component={Perfil}
        options={{ animation: "slide_from_right" }}
      />

      {/* 🔹 NOVA TELA: editar perfil */}
      <Stack.Screen
        name="EditarPerfil"
        component={EditarPerfil}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />

      {/* Listas */}
      <Stack.Screen
        name="Noticias"
        component={Noticias}
        options={{ headerShown: true, title: "Notícias" }}
      />
      <Stack.Screen
        name="Doacoes"
        component={Doacoes}
        options={{ headerShown: true, title: "Doações" }}
      />
      <Stack.Screen
        name="Vendas"
        component={Vendas}
        options={{ headerShown: true, title: "Vendas" }}
      />
      <Stack.Screen
        name="Vagas"
        component={Vagas}
        options={{ headerShown: true, title: "Vagas" }}
      />

      {/* Detalhes */}
      <Stack.Screen
        name="DetalheNoticia"
        component={DetalheNoticia}
        options={{ headerShown: true, title: "Notícia" }}
      />
      <Stack.Screen
        name="DetalheDoacao"
        component={DetalheDoacao}
        options={{ headerShown: true, title: "Doação" }}
      />
      <Stack.Screen
        name="DetalheVenda"
        component={DetalheVenda}
        options={{ headerShown: true, title: "Venda" }}
      />
      <Stack.Screen
        name="DetalheVaga"
        component={DetalheVaga}
        options={{ headerShown: true, title: "Vaga" }}
      />
    </Stack.Navigator>
  );
}
