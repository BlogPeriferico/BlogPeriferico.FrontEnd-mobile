import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";

import Header from "../../components/Header";

export default function SobreNos() {
return (
    <View style={styles.container}>
        <Header />
      {/* Imagem */}
      <Image
        source={require("../../assets/images/skyscraperssunset1.png")} // substitua pelo caminho certo da imagem
        style={styles.image}
        resizeMode="cover"
      />

      {/* Box cinza com textos */}
      <View style={styles.box}>
        <Text style={styles.titulo}>São Paulo, estado do Movimento Constante</Text>
        <Text style={styles.descricao}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
        </Text>
      </View>

      {/* Box cinza com textos */}
     <View style={styles.box2}>
  {/* Barrinha no topo */}
  <View style={styles.barContainer}>
    <View style={styles.barLeft} />
    <View style={styles.barRight} />
  </View>

  {/* Conteúdo */}
  <Text style={styles.sobrenoslight}>Sobre nós</Text>
  <Text style={styles.titulo2}>Qual a finalidade do nosso site?</Text>
  <Text style={styles.descricao2}>
    Nosso site é especialmente para moradores de áreas periféricas que não têm fácil acesso a informações do dia a dia.
  </Text>
  <Text style={styles.funcionalidades}>Funcionalidades </Text>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 370,
    height: 230,
      borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  },
  box: {
    backgroundColor: "#f5f5f5", // cinza clarinho
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 370,
    height: 100,
      // sombra iOS
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,


  elevation: 4,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "light",
    marginBottom: 15,
    textAlign: "center",
    color: "#000",
    fontFamily: "Poppins-light",
  },

  descricao: {
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },

  barContainer: {
  flexDirection: "row",
  marginBottom: 8,
},

barLeft: {
  width: 50,
  height: 8,
  backgroundColor: "#2C3550", // cor escura
  borderTopLeftRadius: 5,
},

barRight: {
  width: 180,
  height: 8,
  backgroundColor: "#6D83F2", // cor clara
  borderTopRightRadius: 5,
},


  box2:{
    backgroundColor: "#f5f5f5",
    borderTopRightRadius: 5,
    borderbottomRightRadius: 5,
    borderottomleftRadius: 5,
  },

  sobrenoslight:{
    fontSize: 14,
    color: "#999393",
    fontFamily: "Poppins-light",
    height: 152,
    width: 358,

  },

  funcionalidades:{
    fontSize: 12,
    color: "#303D61",
    
  },
});

    
