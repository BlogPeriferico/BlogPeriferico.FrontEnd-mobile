import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { styles as s } from "../../styles/perfil/EditarPerfilStyles";
import Fundo from "../../assets/images/Fundo_login.png";

import StatusModal from "../../components/ui/StatusModal";
import { getUserId } from "../../services/auth";
import api from "../../services/api";
import { usuarioUtils } from "../../services/usuario";

const validarEmail = (e) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(String(e || "").trim());

function getIniciais(nome) {
  const parts = String(nome || "")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (!parts.length) return "BP";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

export default function EditarPerfil({ navigation }) {
  const [userId, setUserId] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [fotoUrl, setFotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [campoInvalido, setCampoInvalido] = useState({
    nome: false,
    email: false,
  });

  const [modal, setModal] = useState({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const showModal = (cfg) =>
    setModal((old) => ({ ...old, visible: true, ...cfg }));

  const closeModal = () => setModal((m) => ({ ...m, visible: false }));

  const carregarPerfil = useCallback(async () => {
    try {
      setLoading(true);

      const uid = await getUserId();
      if (!uid) {
        showModal({
          type: "error",
          title: "Sessão expirada",
          message: "Faça login novamente para editar seu perfil.",
        });
        return;
      }

      setUserId(uid);

      // mesmo endpoint do Perfil: /usuarios/listar/{id}
      const { data } = await api.get(`/usuarios/listar/${uid}`);

      const nomeBack = data?.nome || "";
      const emailBack = data?.email || "";
      const bioBack = data?.bio || "";

      const fotoRaw =
        data?.fotoPerfil ||
        data?.foto ||
        data?.imagemPerfil ||
        data?.avatarUrl ||
        "";

      const url = usuarioUtils.ensureAbsoluteUrl(fotoRaw);

      setNome(nomeBack);
      setEmail(emailBack);
      setBio(bioBack);
      setFotoUrl(url);
    } catch (e) {
      console.log(
        "❌ [EditarPerfil] erro ao carregar perfil:",
        e?.message || e
      );
      showModal({
        type: "error",
        title: "Erro ao carregar",
        message: "Não foi possível carregar seus dados de perfil.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const handleSalvar = async () => {
    if (salvando) return;

    const nomeTrim = nome.trim();
    const emailTrim = email.trim();
    const bioTrim = bio.trim();

    const invalido = {
      nome: !nomeTrim || nomeTrim.length < 3,
      email: !validarEmail(emailTrim),
    };

    setCampoInvalido(invalido);

    if (invalido.nome || invalido.email) {
      let msg = "Corrija os campos antes de salvar:\n";
      if (invalido.nome) msg += "• Nome (mín. 3 caracteres)\n";
      if (invalido.email) msg += "• E-mail válido";
      showModal({
        type: "error",
        title: "Campos inválidos",
        message: msg,
      });
      return;
    }

    if (!userId) {
      showModal({
        type: "error",
        title: "Sessão expirada",
        message: "Não foi possível identificar o usuário logado.",
      });
      return;
    }

    try {
      setSalvando(true);

      // alinhado com o back: PATCH /usuarios/atualizar/{id}
      const payload = {
        nome: nomeTrim,
        email: emailTrim,
        bio: bioTrim, // se o back ignorar, suave; se aceitar, melhor
      };

      await api.patch(`/usuarios/atualizar/${userId}`, payload);

      showModal({
        type: "success",
        title: "Perfil atualizado",
        message: "Suas informações foram salvas com sucesso!",
      });
    } catch (e) {
      console.log("❌ [EditarPerfil] erro ao salvar:", e?.message || e);
      showModal({
        type: "error",
        title: "Erro ao salvar",
        message:
          e?.response?.data?.message ||
          "Ocorreu um erro ao salvar as alterações. Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleGoBack = () => {
    if (navigation && navigation.goBack) navigation.goBack();
  };

  const handleRedefinirSenha = () => {
    // ajusta se o nome da rota for outro
    if (navigation && navigation.navigate) {
      navigation.navigate("RedefinirSenha");
    }
  };

  const iniciais = getIniciais(nome);

  return (
    <ImageBackground source={Fundo} style={s.background} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.overlay}>
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* topo com botão voltar + título */}
            <View style={s.headerRow}>
              <TouchableOpacity
                onPress={handleGoBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>

              <Text style={s.titulo}>Editar Perfil</Text>
            </View>

            <Text style={s.subtitulo}>Edite seu perfil</Text>

            {/* CARD PRINCIPAL */}
            <View style={s.cardWrapper}>
              <View style={s.card}>
                {/* Avatar sobreposto */}
                <View style={s.avatarWrap}>
                  {fotoUrl ? (
                    <Image
                      source={{ uri: fotoUrl }}
                      style={s.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={s.avatarFallback}>
                      <Text style={s.avatarFallbackText}>{iniciais}</Text>
                    </View>
                  )}
                </View>

                {loading ? (
                  <View style={s.loadingArea}>
                    <ActivityIndicator size="large" color="#4B5563" />
                  </View>
                ) : (
                  <>
                    {/* Nome */}
                    <TextInput
                      value={nome}
                      onChangeText={(t) => {
                        setNome(t);
                        setCampoInvalido((p) => ({ ...p, nome: false }));
                      }}
                      placeholder="Seu nome"
                      placeholderTextColor="#9CA3AF"
                      style={[s.input, campoInvalido.nome && s.inputErro]}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />

                    {/* Email */}
                    <TextInput
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        setCampoInvalido((p) => ({ ...p, email: false }));
                      }}
                      placeholder="email@exemplo.com"
                      placeholderTextColor="#9CA3AF"
                      style={[s.input, campoInvalido.email && s.inputErro]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />

                    

                    {/* Botão salvar */}
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={handleSalvar}
                      disabled={salvando}
                      style={{ width: "100%", marginTop: 12 }}
                    >
                      <LinearGradient
                        colors={["#9B9B9B", "#6F6F6F"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={[
                          s.botaoGradiente,
                          salvando && { opacity: 0.7 },
                        ]}
                      >
                        {salvando ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={s.botaoTexto}>Salvar Edição</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Link "Redefinir senha" */}
                    <View style={s.senhaRow}>
                      <Text style={s.senhaText}>Alterar minha senha </Text>
                      <TouchableOpacity onPress={handleRedefinirSenha}>
                        <Text style={s.senhaLink}>Redefinir Senha</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de status */}
      <StatusModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryText="OK"
        onPrimary={closeModal}
        onRequestClose={closeModal}
      />
    </ImageBackground>
  );
}
