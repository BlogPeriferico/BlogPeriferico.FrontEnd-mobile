import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Header from "../../components/Header";
import CardClima from "../../components/CardClima";
import { styles } from "../../styles/news/NoticiasStyles";

// Ícones em SVG
import Megafone from "../../assets/svgs/Megafone.svg";
import MaoCoracao from "../../assets/svgs/MaoCoracao.svg";
import Lupa from "../../assets/svgs/Lupa.svg";
import Jornal from "../../assets/svgs/Jornal.svg";
import Eye from "../../assets/svgs/Eye.svg";
import ChatCircleDots from "../../assets/svgs/ChatCircleDots.svg";
import Add from "../../assets/svgs/Add.svg";

const noticiasMock = [
  {
    id: "1",
    titulo: "Desemprego vai ter um aumento de 6,5% no trimestre",
    regiao: "Sudeste",
    data: "17/04/25 15:36",
    imagem:
      "https://blogperiferico.blob.core.windows.net/noticias/noticia_demo.png",
  },
  {
    id: "2",
    titulo: "Estudo revela novas descobertas sobre o universo",
    regiao: "Centro",
    data: "17/04/25 12:20",
    imagem:
      "https://blogperiferico.blob.core.windows.net/noticias/noticia_demo.png",
  },
];

export default function Noticias() {
  const [noticias, setNoticias] = useState(noticiasMock);

  const renderNoticia = ({ item }) => (
    <View style={styles.cardNoticia}>
      <Image source={{ uri: item.imagem }} style={styles.imagemNoticia} />
      <View style={styles.infoNoticia}>
        <Text style={styles.tituloNoticia}>{item.titulo}</Text>
        <Text style={styles.subInfo}>
          {item.regiao} • {item.data}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card de clima (carrossel) */}
        <CardClima />

        {/* Área de climatização */}
        <View style={styles.areaClimaCard}>
          <Text style={styles.areaClimaTitulo}>Área de climatização</Text>

          <Text style={styles.areaClimaDesc}>
            Nossas cores são baseadas nas cores das zonas{"\n"}
            da SpTrans
          </Text>

          <TouchableOpacity onPress={() => { /* TODO: navegar/abrir modal */ }}>
            <Text style={styles.areaClimaLink}>Por que das cores?</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de notícias */}
        <View style={styles.selecaoNoticias}>
          <Text style={styles.tituloSecao}>Seleção de notícias</Text>

          <View style={styles.iconesLinha}>
            <TouchableOpacity>
              <Jornal width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Megafone width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaoCoracao width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Eye width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <ChatCircleDots width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Add width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de notícias */}
        <FlatList
          data={noticias}
          renderItem={renderNoticia}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Botão ver mais */}
        <TouchableOpacity style={styles.botaoMais}>
          <Text style={styles.textoMais}>VER MAIS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
