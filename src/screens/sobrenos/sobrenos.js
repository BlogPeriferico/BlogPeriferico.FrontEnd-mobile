import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; 

import NoticiasScreen from "../news/Noticias.js";
import DoacoesScreen from "../doacoes/Doacoes.js";
import AchadinhosScreen from "../achadinhos/Achadinhos.js";
import MaoAmigaScreen from "../maoamiga/MaoAmiga.js";

import IconNews from "../../assets/svgs/tab/Jornal.svg";
import IconHandHeart from "../../assets/svgs/tab/MaoCoracao.svg";
import IconStore from "../../assets/svgs/tab/Loja.svg";
import IconMegaphone from "../../assets/svgs/tab/Megafone.svg";

import Header from "../../components/Header";

export default function SobreNos() {
  const navigation = useNavigation(); 

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      {/* Imagem */}
      <Image
        source={require("../../assets/images/skyscraperssunset1.png")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Box cinza com textos */}
      <View style={styles.box}>
        <Text style={styles.titulo}>São Paulo, estado do Movimento Constante</Text>
        <Text style={styles.descricao}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna.
        </Text>
      </View>

      {/* Box cinza com textos + botões */}
      <View style={styles.box2}>
        <View style={styles.barContainer}>
          <View style={styles.barLeft} />
          <View style={styles.barRight} />
        </View>

        <Text style={styles.sobrenoslight}>Sobre nós</Text>
        <Text style={styles.titulo2}>Qual a finalidade do nosso site?</Text>
        <Text style={styles.descricao2}>
          Nosso site é especialmente para moradores de áreas periféricas que não
          têm fácil acesso a informações do dia a dia.
        </Text>
        <Text style={styles.funcionalidades}>Funcionalidades</Text>
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NoticiasTab")} 
      >
        <View style={styles.iconContainer}>
          <IconNews width={24} height={24} />
        </View>
        <View style={styles.buttonContent}>
          <View style={styles.blueBar} />
          <Text style={styles.buttonText}>Notícias</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DoacoesTab")} 
      >
        <View style={styles.iconContainer}>
          <IconHandHeart width={24} height={24} />
        </View>
        <View style={styles.buttonContent}>
          <View style={styles.blueBar} />
          <Text style={styles.buttonText}>Doações</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AchadinhosTab")} 
      >
        <View style={styles.iconContainer}>
          <IconStore width={24} height={24} />
        </View>
        <View style={styles.buttonContent}>
          <View style={styles.blueBar} />
          <Text style={styles.buttonText}>Achadinhos</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MaoAmigaTab")} 
      >
        <View style={styles.iconContainer}>
          <IconMegaphone width={24} height={24} />
        </View>
        <View style={styles.buttonContent}>
          <View style={styles.blueBar} />
          <Text style={styles.buttonText}>Mão Amiga</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingBottom: 80, // evita sobreposição da bottom bar
  },
  image: {
    width: 370,
    height: 230,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  box: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 370,
    height: 100,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  titulo: {
    fontSize: 14,
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
    backgroundColor: "#2C3550",
    borderTopLeftRadius: 5,
  },
  barRight: {
    width: 180,
    height: 8,
    backgroundColor: "#6D83F2",
    borderTopRightRadius: 5,
  },
  box2: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginTop: 15,
    width: 370,
    padding: 15,
  },
  sobrenoslight: {
    fontSize: 14,
    color: "#999393",
    fontFamily: "Poppins-light",
    marginBottom: 5,
  },
  funcionalidades: {
    fontSize: 12,
    color: "#303D61",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    width: 267,
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 55,
    backgroundColor: "#e5e5e5",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  blueBar: {
    width: "100%",
    height: 5,
    backgroundColor: "#6D83F2",
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#000000ff",
  },
});
