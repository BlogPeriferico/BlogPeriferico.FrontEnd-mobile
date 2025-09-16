import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { styles as s } from "../../styles/news/DetalheNoticiaStyles";

function formatDatePt(dateIso) {
  try {
    const d = new Date(dateIso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = String(d.getFullYear()).slice(-2);
    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${hora}:${min}`;
  } catch {
    return "";
  }
}

export default function DetalheNoticia({ route, navigation }) {
  const noticia = route?.params?.noticia;
  const { colors } = useRegionTheme();

  const dataStr = useMemo(() => formatDatePt(noticia?.dataIso), [noticia?.dataIso]);
  const tituloTop = useMemo(
    () => (noticia?.titulo ? String(noticia.titulo).trim() : "Detalhe"),
    [noticia?.titulo]
  );

  if (!noticia) {
    return (
      <View style={s.notFoundContainer}>
        <Text style={s.notFoundTitle}>Notícia não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.notFoundButton}>
          <Text style={s.notFoundButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Header />

      {/* Barra superior */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode="tail" style={s.topTitle}>
          {tituloTop}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent}>
        {noticia.imagem ? (
          <Image source={{ uri: noticia.imagem }} style={s.cover} />
        ) : null}

        <Text style={s.title}>{noticia.titulo}</Text>

        {/* Linha autor + meta */}
        <View style={s.metaRow}>
          <View style={s.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={s.author}>{noticia.autorNome || "Autor"}</Text>
            <View style={s.metaSubRow}>
              <Text style={s.metaText}>{dataStr}</Text>
              <View style={s.dot} />
              <Text style={s.metaText}>{noticia.regiao || "Sudeste"}</Text>
            </View>
          </View>
        </View>

        <View style={s.separator} />

        <View style={s.commentsHeader}>
          <Text style={s.commentsCount}>
            {Number.isFinite(noticia.comments)
              ? `${noticia.comments} comentarios`
              : "4 comentarios"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </View>

        <Text style={s.body}>{noticia.subtitulo}</Text>
      </ScrollView>
    </View>
  );
}
