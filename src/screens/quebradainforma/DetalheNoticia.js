import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useRegionTheme } from "../../utils/regionTheme";
import { styles as s } from "../../styles/news/DetalheNoticiaStyles";
import api from "../../services/api";
import { getToken, getUserId } from "../../services/auth";

/**  datas  */
function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === "object" && ("year" in val) && ("monthValue" in val) && ("dayOfMonth" in val)) {
    const y = val.year;
    const m = (val.monthValue || val.month || 1) - 1;
    const d = val.dayOfMonth || val.day || 1;
    const H = val.hour || 0;
    const M = val.minute || 0;
    const S = val.second || 0;
    return new Date(y, m, d, H, M, S);
  }
  if (typeof val === "string") {
    let s = val.trim();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
      s = s.replace(" ", "T");
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d;
    if (!s.endsWith("Z") && !/[\+\-]\d{2}:\d{2}$/.test(s)) {
      const d2 = new Date(s + "Z");
      if (!Number.isNaN(d2.getTime())) return d2;
    }
  }
  const fallback = new Date(val);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}
function formatDatePt(v) {
  const d = toDate(v);
  if (!d) return "";
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = String(d.getFullYear()).slice(-2);
  return `${dia}/${mes}/${ano}`;
}

/**  autor  */
function resolveUsuarioId(n) {
  if (!n) return null;
  const u = n.idUsuario;
  if (typeof u === "number" || typeof u === "string") return Number(u);
  if (u && typeof u === "object" && u.id != null) return Number(u.id);
  if (n.usuario?.id != null) return Number(n.usuario.id);
  if (n.usuario_id != null) return Number(n.usuario_id);
  if (n.usuarioId != null) return Number(n.usuarioId);
  return null;
}
function resolveAutorInline(n) {
  if (!n) return null;
  return n.nomeAutor || n.nomeUsuario || n.autorNome || n.usuario?.nome || null;
}

/**  conteúdo/descrição  */
function sanitizeStr(x) {
  if (x == null) return "";
  const s = String(x).trim();
  if (s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";
  return s;
}
function stripHtml(x) {
  return x.replace(/<[^>]+>/g, "");
}

/*  mapa de usuários  */
async function fetchUsuariosMap() {
  try {
    const { data } = await api.get("/usuarios/listar");
    const arr = Array.isArray(data) ? data : [];
    const byId = new Map();
    for (const u of arr) {
      const id = u?.id ?? u?.id_usuario ?? null;
      if (id != null) {
        byId.set(Number(id), {
          nome: u?.nome ?? "Usuário",
          fotoPerfil: u?.fotoPerfil ?? null,
        });
      }
    }
    return byId;
  } catch {
    return new Map();
  }
}
function hydrateComentariosWithUsers(lista, usuariosById) {
  return (lista || []).map((c) => {
    const info = usuariosById.get(Number(c?.idUsuario));
    return {
      ...c,
      nomeUsuario: c?.nomeUsuario || info?.nome || "Usuário",
      fotoUsuario: c?.fotoUsuario || info?.fotoPerfil || null,
    };
  });
}

export default function DetalheNoticia({ route, navigation }) {
  const noticiaParam = route?.params?.noticia;
  const idParam = route?.params?.id;
  const { colors } = useRegionTheme();

  const [noticia, setNoticia] = useState(noticiaParam || null);
  const [loadingNoticia, setLoadingNoticia] = useState(!noticiaParam);
  const [erro, setErro] = useState("");

  const [autor, setAutor] = useState("Autor desconhecido");
  const [autorFoto, setAutorFoto] = useState(null); 
  const [loadingAutor, setLoadingAutor] = useState(true);

  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);

  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [usuariosById, setUsuariosById] = useState(new Map());
  const [meuAvatar, setMeuAvatar] = useState(null);

  const needsFetchFromParam =
    (!!noticiaParam &&
      (!sanitizeStr(noticiaParam?.texto) &&
        !sanitizeStr(noticiaParam?.descricao) &&
        !sanitizeStr(noticiaParam?.conteudo) &&
        !sanitizeStr(noticiaParam?.content) &&
        !sanitizeStr(noticiaParam?.body)
      )) ||
    noticiaParam?.dataHoraCriacao == null ||
    resolveUsuarioId(noticiaParam) == null;

  // carrega mapa de usuários + notícia + meu avatar
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const map = await fetchUsuariosMap();
        if (!live) return;
        setUsuariosById(map);

        if (noticiaParam && !needsFetchFromParam) {
          setNoticia(noticiaParam);
          setLoadingNoticia(false);
        } else {
          const idUsar = idParam ?? noticiaParam?.id;
          if (idUsar != null) {
            setLoadingNoticia(true);
            const { data } = await api.get(`/noticias/${idUsar}`);
            if (!live) return;
            setNoticia(data);
          } else {
            setErro("Parâmetros inválidos para abrir a notícia.");
          }
        }

        const uid = await getUserId();
        if (uid && map.has(Number(uid))) {
          setMeuAvatar(map.get(Number(uid))?.fotoPerfil || null);
        } else {
          setMeuAvatar(null);
        }
      } catch (e) {
        if (live) setErro(e?.message || "Erro ao carregar notícia");
      } finally {
        if (live) setLoadingNoticia(false);
      }
    })();
    return () => { live = false; };
  }, [noticiaParam, idParam, needsFetchFromParam]);

  // Autor 
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoadingAutor(true);
        const inline = resolveAutorInline(noticia);
        const uid = resolveUsuarioId(noticia);

        // Tenta resolver pelo mapa (um GET a menos)
        if (uid && usuariosById.has(Number(uid))) {
          const info = usuariosById.get(Number(uid));
          if (!live) return;
          setAutor(inline || info?.nome || "Autor desconhecido");
          setAutorFoto(info?.fotoPerfil || null);
          setLoadingAutor(false);
          return;
        }

        // Se não tinha no mapa mas temos uid, busca direto
        if (uid) {
          const { data } = await api.get(`/usuarios/listar/${uid}`);
          if (!live) return;
          setAutor(inline || data?.nome || "Autor desconhecido");
          setAutorFoto(data?.fotoPerfil || null);
          setLoadingAutor(false);
          return;
        }

        // Sem uid: usa inline e sem foto
        if (!live) return;
        setAutor(inline || "Autor desconhecido");
        setAutorFoto(null);
      } catch {
        setAutor("Autor desconhecido");
        setAutorFoto(null);
      } finally {
        setLoadingAutor(false);
      }
    })();
    return () => { live = false; };
  }, [noticia, usuariosById]);

  // Comentários – preview
  useEffect(() => {
    (async () => {
      try {
        if (noticia?.id) {
          const { data } = await api.get(`/comentarios/noticia/${noticia.id}`);
          const arr = Array.isArray(data) ? data : [];
          setComentarios(hydrateComentariosWithUsers(arr, usuariosById));
        }
      } catch {
        setComentarios([]);
      }
    })();
  }, [noticia?.id, usuariosById]);

  // Comentários – ao abrir seção
  useEffect(() => {
    (async () => {
      if (!showComentarios || !noticia?.id) return;
      setLoadingComentarios(true);
      try {
        const { data } = await api.get(`/comentarios/noticia/${noticia.id}`);
        const arr = Array.isArray(data) ? data : [];
        setComentarios(hydrateComentariosWithUsers(arr, usuariosById));
      } catch {
        setComentarios([]);
      } finally {
        setLoadingComentarios(false);
      }
    })();
  }, [showComentarios, noticia?.id, usuariosById]);

  const enviarComentario = useCallback(async () => {
    try {
      const token = await getToken();
      const userId = await getUserId();

      if (!userId) {
        Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
        return;
      }
      if (!novoComentario.trim()) {
        Alert.alert("Aviso", "Digite algo antes de comentar.");
        return;
      }

      setEnviando(true);
      const payload = { texto: novoComentario, idNoticia: noticia.id, idUsuario: Number(userId) };
      const { data } = await api.post("/comentarios", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const info = usuariosById.get(Number(userId));
      const enriquecido = {
        ...data,
        nomeUsuario: data?.nomeUsuario || info?.nome || "Você",
        fotoUsuario: data?.fotoUsuario || info?.fotoPerfil || meuAvatar || null,
      };

      Alert.alert("Sucesso", "Comentário publicado!");
      setNovoComentario("");
      setComentarios((prev) => [...prev, enriquecido]);
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || "Não foi possível enviar o comentário.");
    } finally {
      setEnviando(false);
    }
  }, [novoComentario, noticia?.id, usuariosById, meuAvatar]);

  const dataStr = useMemo(() => formatDatePt(noticia?.dataHoraCriacao), [noticia?.dataHoraCriacao]);

  const tituloTop = useMemo(
    () => (noticia?.titulo ? String(noticia.titulo).trim() : "Detalhe"),
    [noticia?.titulo]
  );

  const descricaoFinal = useMemo(() => {
    const candidates = [
      sanitizeStr(noticia?.texto),
      sanitizeStr(noticia?.descricao),
      sanitizeStr(noticia?.conteudo),
      sanitizeStr(noticia?.content),
      sanitizeStr(noticia?.body),
    ].filter(Boolean);
    const raw = candidates.find((v) => v.length > 0) || "";
    const cleaned = stripHtml(raw).trim();
    return cleaned.length ? cleaned : "Sem conteúdo disponível.";
  }, [noticia?.texto, noticia?.descricao, noticia?.conteudo, noticia?.content, noticia?.body]);

  if (!noticia && !loadingNoticia) {
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

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          {loadingNoticia ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 8, color: "#6B7280" }}>Carregando notícia…</Text>
            </View>
          ) : (
            <>
              {noticia?.imagem ? (
                <Image
                  source={{ uri: noticia.imagem }}
                  style={[s.cover, { alignSelf: "center" }]}
                  resizeMode="contain"
                />
              ) : null}

              <Text style={s.title}>{noticia?.titulo || "Notícia"}</Text>

              {/* Autor + meta */}
              <View style={s.metaRow}>
                {autorFoto ? (
                  <Image source={{ uri: autorFoto }} style={s.avatarImg} />
                ) : (
                  <View style={s.avatar} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={s.author}>{loadingAutor ? "Carregando autor..." : autor}</Text>
                  <View style={s.metaSubRow}>
                    <Text style={s.metaText}>{dataStr}</Text>
                    <View style={s.dot} />
                    <Text style={s.metaText}>{noticia?.zona || "Sudeste"}</Text>
                  </View>
                </View>
              </View>

              {/* Comentários */}
              <TouchableOpacity
                style={s.comentarioToggle}
                onPress={() => setShowComentarios((p) => !p)}
              >
                <Text style={s.comentarioToggleText}>{comentarios.length} comentários</Text>
                <Ionicons
                  name={showComentarios ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#374151"
                />
              </TouchableOpacity>

              {showComentarios && (
                <View style={s.comentariosContainer}>
                  <Text style={s.comentariosTitulo}>Comentários</Text>

                  <View style={s.novoComentarioContainer}>
                    {meuAvatar ? (
                      <Image source={{ uri: meuAvatar }} style={s.avatarImg} />
                    ) : (
                      <View style={s.avatarPlaceholder}>
                        <Ionicons name="person" size={20} color="#888" />
                      </View>
                    )}
                    <TextInput
                      value={novoComentario}
                      onChangeText={setNovoComentario}
                      placeholder="Adicione um comentário..."
                      placeholderTextColor="#9CA3AF"
                      style={s.novoComentarioInput}
                      multiline
                    />
                  </View>
                  <TouchableOpacity
                    style={[s.botaoPublicar, enviando && { opacity: 0.6 }]}
                    onPress={enviarComentario}
                    disabled={enviando}
                  >
                    <Text style={s.botaoPublicarTexto}>
                      {enviando ? "Publicando..." : "Publicar"}
                    </Text>
                  </TouchableOpacity>

                  {loadingComentarios ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : comentarios.length > 0 ? (
                    comentarios.map((item) => (
                      <View key={`${item.id}`} style={s.comentarioItem}>
                        {item.fotoUsuario ? (
                          <Image source={{ uri: item.fotoUsuario }} style={s.avatarImg} />
                        ) : (
                          <View style={s.avatarPlaceholder}>
                            <Ionicons name="person" size={20} color="#888" />
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={s.comentarioHeader}>
                            <Text style={s.comentarioNome}>{item.nomeUsuario || "Usuário"}</Text>
                            <Text style={s.comentarioData}>{formatDatePt(item.dataHoraCriacao)}</Text>
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

              {/* Descrição */}
              <View style={s.separator} />
              <Text style={s.body}>{descricaoFinal}</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
