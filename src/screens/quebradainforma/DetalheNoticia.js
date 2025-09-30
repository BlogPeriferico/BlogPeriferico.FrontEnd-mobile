import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { styles as s } from "../../styles/news/DetalheNoticiaStyles";
import api from "../../services/api";

function formatDatePt(dateIso) {
  try {
    const d = new Date(dateIso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = String(d.getFullYear()).slice(-2);
    return `${dia}/${mes}/${ano}`;
  } catch {
    return "";
  }
}

export default function DetalheNoticia({ route, navigation }) {
  const noticia = route?.params?.noticia;
  const { colors } = useRegionTheme();

  const [autor, setAutor] = useState(null);
  const [loadingAutor, setLoadingAutor] = useState(true);

  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);

  // Buscar autor
  useEffect(() => {
    if (noticia?.idUsuario) {
      api
        .get(`/usuarios/listar/${noticia.idUsuario}`)
        .then((res) => setAutor(res.data.nome))
        .catch(() => setAutor("Autor desconhecido"))
        .finally(() => setLoadingAutor(false));
    } else {
      setAutor("Autor desconhecido");
      setLoadingAutor(false);
    }
  }, [noticia?.idUsuario]);

  // 🔹 Buscar contagem de comentários assim que entrar
  useEffect(() => {
    if (noticia?.id) {
      api
        .get(`/comentarios/noticia/${noticia.id}`)
        .then((res) => setComentarios(res.data))
        .catch(() => setComentarios([]));
    }
  }, [noticia?.id]);

  // 🔹 Buscar comentários completos apenas ao abrir
  useEffect(() => {
    if (showComentarios && noticia?.id) {
      setLoadingComentarios(true);
      api
        .get(`/comentarios/noticia/${noticia.id}`)
        .then((res) => setComentarios(res.data))
        .catch(() => setComentarios([]))
        .finally(() => setLoadingComentarios(false));
    }
  }, [showComentarios]);

  const dataStr = useMemo(
    () => formatDatePt(noticia?.dataHoraCriacao),
    [noticia?.dataHoraCriacao]
  );

  const tituloTop = useMemo(
    () => (noticia?.titulo ? String(noticia.titulo).trim() : "Detalhe"),
    [noticia?.titulo]
  );

  if (!noticia) {
    return (
      <View style={s.notFoundContainer}>
        <Text style={s.notFoundTitle}>Notícia não encontrada</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.notFoundButton}
        >
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

      {/* Conteúdo da notícia */}
      <View style={s.scrollContent}>
        {noticia.imagem ? (
          <Image
            source={{ uri: noticia.imagem }}
            style={[s.cover, { alignSelf: "center" }]}
            resizeMode="contain"
          />
        ) : null}

        <Text style={s.title}>{noticia.titulo}</Text>

        {/* Linha autor + meta */}
        <View style={s.metaRow}>
          <View style={s.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={s.author}>
              {loadingAutor ? "Carregando autor..." : autor}
            </Text>
            <View style={s.metaSubRow}>
              <Text style={s.metaText}>{dataStr}</Text>
              <View style={s.dot} />
              <Text style={s.metaText}>{noticia.zona || "Sudeste"}</Text>
            </View>
          </View>
        </View>

        {/* Botão de toggle de comentários */}
        <TouchableOpacity
          style={s.comentarioToggle}
          onPress={() => setShowComentarios((prev) => !prev)}
        >
          <Text style={s.comentarioToggleText}>
            {comentarios.length} comentarios
          </Text>
          <Ionicons
            name={showComentarios ? "chevron-up" : "chevron-down"}
            size={18}
            color="#374151"
          />
        </TouchableOpacity>

        {/* Seção de comentários */}
        {showComentarios && (
          <View style={s.comentariosContainer}>
            <Text style={s.comentariosTitulo}>Comentarios</Text>

            {loadingComentarios ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : comentarios.length > 0 ? (
              comentarios.map((item) => (
                <View key={item.id} style={s.comentarioItem}>
                  {item.fotoUsuario ? (
                    <Image
                      source={{ uri: item.fotoUsuario }}
                      style={s.avatarImg}
                    />
                  ) : (
                    <View style={s.avatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#888" />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <View style={s.comentarioHeader}>
                      <Text style={s.comentarioNome}>{item.nomeUsuario}</Text>
                      <Text style={s.comentarioData}>
                        {formatDatePt(item.dataHoraCriacao)}
                      </Text>
                    </View>
                    <Text style={s.comentarioTexto}>{item.texto}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={s.semComentarios}>Nenhum comentário ainda.</Text>
            )}
          </View>
        )}

        <View style={s.separator} />
        <Text style={s.body}>{noticia.texto}</Text>
      </View>
    </View>
  );
}
