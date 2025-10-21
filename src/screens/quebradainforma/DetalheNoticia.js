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

const dbg = (...a) => console.log("📰[DetalheNoticia]", ...a);

/** ==== datas robustas ==== */
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

/** ==== autor ==== */
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

/** ==== conteúdo/descrição ==== */
function sanitizeStr(x) {
  if (x == null) return "";
  const s = String(x).trim();
  if (s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";
  return s;
}
function stripHtml(x) {
  return x.replace(/<[^>]+>/g, "");
}

export default function DetalheNoticia({ route, navigation }) {
  const noticiaParam = route?.params?.noticia;
  const idParam = route?.params?.id;
  const { colors } = useRegionTheme();

  const [noticia, setNoticia] = useState(noticiaParam || null);
  const [loadingNoticia, setLoadingNoticia] = useState(!noticiaParam);
  const [erro, setErro] = useState("");

  const [autor, setAutor] = useState("Autor desconhecido");
  const [loadingAutor, setLoadingAutor] = useState(true);

  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);

  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  /** precisa refazer fetch se a rota mandou uma notícia incompleta */
  const needsFetchFromParam =
    !!noticiaParam &&
    (
      !sanitizeStr(noticiaParam?.texto) &&
      !sanitizeStr(noticiaParam?.descricao) &&
      !sanitizeStr(noticiaParam?.conteudo) &&
      !sanitizeStr(noticiaParam?.content) &&
      !sanitizeStr(noticiaParam?.body)
    ) ||
    noticiaParam?.dataHoraCriacao == null ||
    resolveUsuarioId(noticiaParam) == null;

  // Busca notícia completa se necessário
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        if (noticiaParam && !needsFetchFromParam) {
          dbg("via params (completo):", noticiaParam?.id);
          setNoticia(noticiaParam);
          setLoadingNoticia(false);
          return;
        }
        const idUsar = idParam ?? noticiaParam?.id;
        if (idUsar != null) {
          setLoadingNoticia(true);
          dbg("GET /noticias/", idUsar);
          const { data } = await api.get(`/noticias/${idUsar}`);
          dbg("RESP noticia:", data?.id);
          if (live) setNoticia(data);
        } else {
          setErro("Parâmetros inválidos para abrir a notícia.");
        }
      } catch (e) {
        dbg("ERRO carregar noticia:", e?.message || e);
        if (live) setErro(e?.message || "Erro ao carregar notícia");
      } finally {
        if (live) setLoadingNoticia(false);
      }
    })();
    return () => { live = false; };
  }, [noticiaParam, idParam, needsFetchFromParam]);

  useEffect(() => { if (noticia) dbg("STATE noticia:", JSON.stringify(noticia, null, 2)); }, [noticia]);

  // Autor
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoadingAutor(true);
        const inline = resolveAutorInline(noticia);
        if (inline) {
          if (!live) return;
          setAutor(inline);
          setLoadingAutor(false);
          return;
        }
        const uid = resolveUsuarioId(noticia);
        if (!uid) {
          if (!live) return;
          setAutor("Autor desconhecido");
          setLoadingAutor(false);
          return;
        }
        dbg("GET /usuarios/listar/", uid);
        const { data } = await api.get(`/usuarios/listar/${uid}`);
        dbg("RESP usuario:", data?.id, data?.nome);
        if (!live) return;
        setAutor(data?.nome || "Autor desconhecido");
      } catch (e) {
        dbg("ERRO autor:", e?.message || e);
        setAutor("Autor desconhecido");
      } finally {
        setLoadingAutor(false);
      }
    })();
    return () => { live = false; };
  }, [noticia]);

  // Comentários – preview
  useEffect(() => {
    (async () => {
      try {
        if (noticia?.id) {
          dbg("GET /comentarios/noticia/", noticia.id);
          const { data } = await api.get(`/comentarios/noticia/${noticia.id}`);
          dbg("RESP comentarios count:", Array.isArray(data) ? data.length : 0);
          setComentarios(Array.isArray(data) ? data : []);
        }
      } catch {
        setComentarios([]);
      }
    })();
  }, [noticia?.id]);

  // Comentários – ao abrir seção
  useEffect(() => {
    (async () => {
      if (!showComentarios || !noticia?.id) return;
      setLoadingComentarios(true);
      try {
        dbg("GET /comentarios/noticia/ (abrir)", noticia.id);
        const { data } = await api.get(`/comentarios/noticia/${noticia.id}`);
        dbg("RESP comentarios (abrir):", Array.isArray(data) ? data.length : 0);
        setComentarios(Array.isArray(data) ? data : []);
      } catch {
        setComentarios([]);
      } finally {
        setLoadingComentarios(false);
      }
    })();
  }, [showComentarios, noticia?.id]);

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
      dbg("POST /comentarios", payload);
      const { data } = await api.post("/comentarios", payload, { headers: { Authorization: `Bearer ${token}` } });
      dbg("RESP criar comentario:", data?.id);
      Alert.alert("Sucesso", "Comentário publicado!");
      setNovoComentario("");
      setComentarios((prev) => [...prev, data]);
    } catch (e) {
      dbg("ERRO comentar:", e?.message || e, e?.response?.data);
      Alert.alert("Erro", e?.response?.data?.message || "Não foi possível enviar o comentário.");
    } finally {
      setEnviando(false);
    }
  }, [novoComentario, noticia?.id]);

  const dataStr = useMemo(() => formatDatePt(noticia?.dataHoraCriacao), [noticia?.dataHoraCriacao]);

  const tituloTop = useMemo(
    () => (noticia?.titulo ? String(noticia.titulo).trim() : "Detalhe"),
    [noticia?.titulo]
  );

  const descricaoFinal = useMemo(() => {
    // cobre vários campos possíveis e remove HTML simples
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
                <Image source={{ uri: noticia.imagem }} style={[s.cover, { alignSelf: "center" }]} resizeMode="contain" />
              ) : null}

              <Text style={s.title}>{noticia?.titulo || "Notícia"}</Text>

              {/* Autor + meta */}
              <View style={s.metaRow}>
                <View style={s.avatar} />
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
              <TouchableOpacity style={s.comentarioToggle} onPress={() => setShowComentarios((p) => !p)}>
                <Text style={s.comentarioToggleText}>{comentarios.length} comentários</Text>
                <Ionicons name={showComentarios ? "chevron-up" : "chevron-down"} size={18} color="#374151" />
              </TouchableOpacity>

              {showComentarios && (
                <View style={s.comentariosContainer}>
                  <Text style={s.comentariosTitulo}>Comentários</Text>

                  <View style={s.novoComentarioContainer}>
                    <View style={s.avatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#888" />
                    </View>
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
                    <Text style={s.botaoPublicarTexto}>{enviando ? "Publicando..." : "Publicar"}</Text>
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

              {/* Descrição SEMPRE abaixo */}
              <View style={s.separator} />
              <Text style={s.body}>{descricaoFinal}</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
