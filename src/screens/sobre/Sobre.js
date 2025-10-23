import React, { useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import IconNews from "../../assets/svgs/tab/Jornal.svg";
import IconHandHeart from "../../assets/svgs/tab/MaoCoracao.svg";
import IconStore from "../../assets/svgs/tab/Loja.svg";
import IconMegaphone from "../../assets/svgs/tab/Megafone.svg";
import styles from "../../styles/sobre/SobreStyles";

const HERO_URL = "https://blogperic0.blob.core.windows.net/imgsp/skyscraperssunset1.png";

export default function SobreNos() {
  const navigation = useNavigation();
  const [imgOk, setImgOk] = useState(true);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      {/* Imagem (remota, com fallback visual) */}
      {imgOk ? (
        <Image
          source={{ uri: "https://blogperic0.blob.core.windows.net/imgsp/skyscraperssunset1.png" }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgOk(false)}
        />
      ) : (
        <View style={[styles.image, { backgroundColor: "#E9ECF3" }]} />
      )}

      {/* Box cinza com textos */}
      <View style={styles.box}>
        <Text style={styles.titulo}>São Paulo, estado do Movimento Constante</Text>
        <Text style={styles.descricao}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna.
        </Text>
      </View>

      {/* Box cinza com textos + barras + subtítulos */}
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

      {/* Botões de atalho */}
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
