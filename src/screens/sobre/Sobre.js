// src/screens/sobre/Sobre.js

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { makeSobreStyles } from "../../styles/sobre/SobreStyles";

export default function Sobre({ navigation }) {
  const { colors } = useRegionTheme();
  const s = makeSobreStyles(colors);

  const [active, setActive] = useState("noticias");

  const sections = {
    noticias:
      "Na área de Notícias você encontra informações sobre o dia a dia das periferias: serviços públicos, cultura, ações da comunidade, alertas e pautas que quase não aparecem na mídia tradicional.",
    doacoes:
      "Em Doações, aproximamos quem precisa de apoio de quem pode contribuir. Campanhas transparentes para alimentos, roupas, materiais escolares, itens essenciais e ajuda direta às famílias da quebrada.",
    vendas:
      "Em Vendas, empreendedores locais e autônomos podem divulgar produtos e serviços. É o espaço para fortalecer o corre da comunidade e movimentar a economia das periferias.",
    vagas:
      "Na área de Vagas você encontra oportunidades de emprego, estágios, freelas, cursos e formações. A ideia é facilitar o acesso a chances reais de crescimento profissional.",
  };

  return (
    <View style={s.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background || "#F5F5F5"}
      />

      {/* Header padrão do app */}
      <Header navigation={navigation} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.cardImagem}>
          <Image
            source={{
              uri: "https://blogperic0.blob.core.windows.net/zonas/fotoSaoPaulo.png",
            }}
            style={s.imagem}
            resizeMode="cover"
          />
          <View style={s.legendaWrapper}>
            <Text style={s.legendaTitulo}>
              São Paulo estado do Movimento Constante
            </Text>
            <Text style={s.legendaTexto}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </Text>
          </View>
        </View>

        {/* Card Sobre nós */}
        <View style={s.cardSobre}>
          <View style={s.tabs}>
            <View style={s.tabAtiva} />
            <View style={s.tabInativa} />
          </View>

          <Text style={s.sobreTituloTopo}>Sobre nós</Text>

          <Text style={s.sobrePergunta}>Qual a finalidade do nosso site?</Text>

          <Text style={s.sobreTexto}>
            O Blog Periférico nasce para organizar e facilitar o acesso à
            informação para quem vive nas periferias. Em vez de depender só de
            grupos soltos e mensagens perdidas, tudo fica concentrado em um
            lugar só.
          </Text>

          <Text style={s.sobreTexto}>
            Nosso foco é dar visibilidade, fortalecer a comunicação da
            comunidade, divulgar oportunidades e apoiar o corre de quem faz a
            quebrada acontecer.
          </Text>

          <Text style={s.linkFuncionalidades}>Funcionalidades &gt;</Text>
        </View>

        {/* Botões das áreas */}
        <View style={s.botoesWrapper}>
          <BotaoSecao
            label="Notícias"
            icon="📄"
            active={active === "noticias"}
            onPress={() => setActive("noticias")}
            s={s}
          />
          <BotaoSecao
            label="Doações"
            icon="🤝"
            active={active === "doacoes"}
            onPress={() => setActive("doacoes")}
            s={s}
          />
          <BotaoSecao
            label="Vendas"
            icon="🛒"
            active={active === "vendas"}
            onPress={() => setActive("vendas")}
            s={s}
          />
          <BotaoSecao
            label="Vagas"
            icon="💼"
            active={active === "vagas"}
            onPress={() => setActive("vagas")}
            s={s}
          />
        </View>

        {/* Texto da área selecionada */}
        <View style={s.descBox}>
          <Text style={s.descTitulo}>
            {active === "noticias" && "Notícias"}
            {active === "doacoes" && "Doações"}
            {active === "vendas" && "Vendas"}
            {active === "vagas" && "Vagas"}
          </Text>
          <Text style={s.descTexto}>{sections[active]}</Text>
        </View>

        {/* Margem pro tab bar (que vem do BottomTabs lá fora) */}
        <View style={s.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function BotaoSecao({ label, icon, active, onPress, s }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[s.botao, active && s.botaoAtivo]}
    >
      <View style={[s.botaoBarra, active && s.botaoBarraAtiva]} />
      <View style={s.botaoConteudo}>
        <Text style={s.botaoIcon}>{icon}</Text>
        <Text style={[s.botaoTexto, active && s.botaoTextoAtivo]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
