import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as s } from "../../styles/vaga/DetalheVagaStyles";
import { styles as listS } from "../../styles/vaga/VagasStyles";
import { styles as ns } from "../../styles/news/DetalheNoticiaStyles"; 
import VagaCard from "../../components/vaga/VagaCard";
import { useRegionTheme } from "../../utils/regionTheme";
import api from "../../services/api";
import { getTodasVagas, paginaVagas } from "../../services/vagas";
import { getToken, getUserId } from "../../services/auth";
import { listComentariosVaga, criarComentarioVaga } from "../../services/comentarios";

function dedupeById(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = it?.id ?? "";
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 16;
const GUTTER = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GUTTER) / 2;

function normalizePhone(telefone) {
  if (!telefone) return null;
  let digits = String(telefone).replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits || null;
}
function buildWhatsAppLink(telefone, titulo) {
  const normalized = normalizePhone(telefone);
  if (!normalized) return null;
  const texto = encodeURIComponent(
    `Olá! Vi sua vaga${titulo ? `: "${titulo}"` : ""} no Blog Periférico e gostaria de saber mais.`
  );
  return `https://wa.me/${normalized}?text=${texto}`;
}

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

export default function DetalheVaga({ route, navigation }) {
  const { colors, regiao } = useRegionTheme();
  const vagaParam = route?.params?.vaga;
  const idParam = route?.params?.id;

  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        if (vagaParam) {
          if (live) setVaga(vagaParam);
        } else if (idParam != null) {
          const { data } = await api.get(`/vagas/${idParam}`);
          if (live) setVaga(data);
        } else {
          throw new Error("Parâmetros inválidos para abrir a vaga.");
        }
      } catch (e) {
        if (live) setErro(e?.message || "Erro ao carregar vaga");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [vagaParam, idParam]);

  const whatsappHref = useMemo(
    () => buildWhatsAppLink(vaga?.telefone, vaga?.titulo),
    [vaga?.telefone, vaga?.titulo]
  );

  const onPressWhats = useCallback(async () => {
    if (!whatsappHref) {
      Alert.alert("Contato indisponível", "Telefone inválido ou ausente.");
      return;
    }
    const supported = await Linking.canOpenURL(whatsappHref);
    if (supported) {
      await Linking.openURL(whatsappHref);
    } else {
      Alert.alert("Não foi possível abrir o WhatsApp", whatsappHref);
    }
  }, [whatsappHref]);

  // Comentários 
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Contagem/preview inicial
  useEffect(() => {
    (async () => {
      try {
        if (vaga?.id) {
          const lista = await listComentariosVaga(vaga.id);
          setComentarios(lista);
        }
      } catch {
        setComentarios([]);
      }
    })();
  }, [vaga?.id]);

  // Lista completa ao abrir a seção
  useEffect(() => {
    (async () => {
      if (showComentarios && vaga?.id) {
        setLoadingComentarios(true);
        try {
          const lista = await listComentariosVaga(vaga.id);
          setComentarios(lista);
        } catch {
          setComentarios([]);
        } finally {
          setLoadingComentarios(false);
        }
      }
    })();
  }, [showComentarios, vaga?.id]);

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

      const criado = await criarComentarioVaga({
        texto: novoComentario,
        idVaga: vaga.id,
        idUsuario: Number(userId),
        token,
      });

      Alert.alert("Sucesso", "Comentário publicado!");
      setNovoComentario("");
      setComentarios((prev) => [...prev, criado]);
    } catch (e) {
      console.error(" Erro ao comentar:", e);
      Alert.alert(
        "Erro",
        e?.response?.data?.message || "Não foi possível enviar o comentário."
      );
    } finally {
      setEnviando(false);
    }
  }, [novoComentario, vaga?.id]);

  // Relacionadas
  const [relLoading, setRelLoading] = useState(true);
  const [relItens, setRelItens] = useState([]);
  const [relState, setRelState] = useState({ page: 1, pageSize: 6, hasMore: true });

  const carregarRelacionadas = useCallback(async (baseId, zonaAtual) => {
    setRelLoading(true);
    try {
      const data = await getTodasVagas();
      const filtradas = (data || [])
        .filter((v) => v.zona?.toLowerCase?.() === zonaAtual?.toLowerCase?.())
        .filter((v) => String(v.id) !== String(baseId));
      const base = dedupeById(filtradas);
      const pg = paginaVagas(base, { page: 1, pageSize: 6 });
      setRelItens(pg.items);
      setRelState({ page: 1, pageSize: 6, hasMore: pg.hasMore });
    } catch {
      setRelItens([]);
      setRelState({ page: 1, pageSize: 6, hasMore: false });
    } finally {
      setRelLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && vaga && regiao) {
      carregarRelacionadas(vaga.id, regiao);
    }
  }, [loading, vaga, regiao, carregarRelacionadas]);

  const verMaisRelacionadas = useCallback(async () => {
    const data = await getTodasVagas();
    const filtradas = (data || [])
      .filter((v) => v.zona?.toLowerCase?.() === regiao?.toLowerCase?.())
      .filter((v) => String(v.id) !== String(vaga?.id));
    const base = dedupeById(filtradas);
    const next = relState.page + 1;
    const pg = paginaVagas(base, { page: next, pageSize: relState.pageSize });
    setRelItens((old) => dedupeById([...old, ...pg.items]));
    setRelState({ page: next, pageSize: relState.pageSize, hasMore: pg.hasMore });
  }, [regiao, vaga?.id, relState.page, relState.pageSize]);

  return (
    <View style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollBody} bounces>
          {!!vaga?.imagem && (
            <View style={s.headerImageWrap}>
              <Image source={{ uri: vaga.imagem }} style={s.headerImage} resizeMode="cover" />
            </View>
          )}

          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          <View style={s.content}>
            <View style={s.breadcrumbRow}>
              <Text style={s.breadcrumbText}>Home</Text>
              <Text style={s.breadcrumbSep}>›</Text>
              <Text style={s.breadcrumbText}>Vagas</Text>
            </View>

            {loading ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={s.statusText}>Carregando vaga…</Text>
              </View>
            ) : erro ? (
              <View style={s.center}>
                <Text style={s.errorText}>{erro}</Text>
              </View>
            ) : (
              <>
                <Text style={s.title} numberOfLines={3}>
                  {vaga?.titulo || "Vaga"}
                </Text>

                <View style={s.ctaRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressWhats}
                    style={[s.ctaBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[s.ctaLabel, { color: colors.onPrimary || "#FFF" }]}>
                      Contatar o Anunciante
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={s.descBox}>
                  <Text style={s.descTitle}>Descrição</Text>
                  <Text style={s.descText}>
                    {vaga?.descricao?.trim()?.length ? vaga.descricao : "Sem descrição fornecida."}
                  </Text>
                </View>

                {/* Comentários */}
                <TouchableOpacity
                  style={ns.comentarioToggle}
                  onPress={() => setShowComentarios((prev) => !prev)}
                >
                  <Text style={ns.comentarioToggleText}>
                    {comentarios.length} comentários
                  </Text>
                  <Ionicons
                    name={showComentarios ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#374151"
                  />
                </TouchableOpacity>

                {showComentarios && (
                  <View style={ns.comentariosContainer}>
                    <Text style={ns.comentariosTitulo}>Comentários</Text>

                    {/* Input */}
                    <View style={ns.novoComentarioContainer}>
                      <View style={ns.avatarPlaceholder}>
                        <Ionicons name="person" size={20} color="#888" />
                      </View>
                      <TextInput
                        value={novoComentario}
                        onChangeText={setNovoComentario}
                        placeholder="Adicione um comentário..."
                        placeholderTextColor="#9CA3AF"
                        style={ns.novoComentarioInput}
                        multiline
                      />
                    </View>
                    <TouchableOpacity
                      style={[ns.botaoPublicar, enviando && { opacity: 0.6 }]}
                      onPress={enviarComentario}
                      disabled={enviando}
                    >
                      <Text style={ns.botaoPublicarTexto}>
                        {enviando ? "Publicando..." : "Publicar"}
                      </Text>
                    </TouchableOpacity>

                    {loadingComentarios ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : comentarios.length > 0 ? (
                      comentarios.map((item) => (
                        <View key={`${item.id}`} style={ns.comentarioItem}>
                          {item.fotoUsuario ? (
                            <Image source={{ uri: item.fotoUsuario }} style={ns.avatarImg} />
                          ) : (
                            <View style={ns.avatarPlaceholder}>
                              <Ionicons name="person" size={20} color="#888" />
                            </View>
                          )}
                          <View style={{ flex: 1 }}>
                            <View style={ns.comentarioHeader}>
                              <Text style={ns.comentarioNome}>{item.nomeUsuario || "Usuário"}</Text>
                              <Text style={ns.comentarioData}>
                                {formatDatePt(item.dataHoraCriacao)}
                              </Text>
                            </View>
                            <Text style={ns.comentarioTexto}>{item.texto}</Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={ns.semComentarios}>Nenhum comentário ainda.</Text>
                    )}
                  </View>
                )}
                {/* Comentários */}
              </>
            )}
          </View>

          <View style={{ paddingHorizontal: H_PADDING, paddingTop: 8 }}>
            <Text style={[listS.tituloSecao, { color: colors.primary, marginBottom: 8 }]}>
              Vagas Relacionadas
            </Text>

            {relLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : relItens.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#6B7280", marginVertical: 16 }}>
                Nenhuma vaga semelhante nesta região.
              </Text>
            ) : (
              <>
                <View style={listS.grid}>
                  {relItens.map((v, index) => {
                    const isLeftCol = index % 2 === 0;
                    return (
                      <VagaCard
                        key={`${v.id}-${index}`}
                        item={v}
                        regiao={regiao}
                        onPress={() => navigation.push("DetalheVaga", { id: v.id, vaga: v })}
                        style={{ width: CARD_W, marginRight: isLeftCol ? GUTTER : 0 }}
                      />
                    );
                  })}
                </View>

                {relState.hasMore && (
                  <TouchableOpacity
                    onPress={verMaisRelacionadas}
                    activeOpacity={0.9}
                    style={[listS.verMaisBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={listS.verMaisLabel}>Ver mais</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
