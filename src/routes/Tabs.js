import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsStack from "./NewsStack";
// IMPORT suas outras telas/tabs aqui se quiser
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#7A7A7A",
      }}
    >
      <Tab.Screen
        name="Noticias"
        component={NewsStack}
        options={{
          tabBarLabel: "Notícias",
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" color={color} size={size} />,
        }}
      />
      
    </Tab.Navigator>
  );
}
