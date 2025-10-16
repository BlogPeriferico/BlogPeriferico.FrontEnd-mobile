import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import CloseEye from "../../assets/svgs/Close_Eye.svg";
import OpenEye from "../../assets/svgs/Open_Eye.svg";
import { styles } from "../../styles/login/LoginStyles";
import Fundo from "../../assets/images/Fundo_login.png";

import { cadastrarUsuario } from "../../services/usuario";
import StatusModal from "../../components/ui/StatusModal";
import { formatApiError } from "../../utils/formatApiError";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [campoInvalido, setCampoInvalido] = useState({ nome: false, email: false, senha: false });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info", title: "", message: "" });

  const validarEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(e?.trim());
  const showError = (m, t="Erro no cadastro") => setModal({ visible: true, type: "error", title: t, message: m });

  const handleRegistrar = async () => {
    if (loading) return;

    const nomeTrim = nome.trim();
    const emailTrim = email.trim();
    const senhaTrim = senha;

    const invalido = {
      nome: !nomeTrim || nomeTrim.length < 3,
      email: !validarEmail(emailTrim),
      senha: !senhaTrim || senhaTrim.length < 6,
    };
    setCampoInvalido(invalido);

    if (invalido.nome || invalido.email || invalido.senha) {
      let msg = "Corrija os campos:\n";
      if (invalido.nome) msg += "• Nome (mín. 3 caracteres)\n";
      if (invalido.email) msg += "• E-mail válido\n";
      if (invalido.senha) msg += "• Senha (mín. 6 caracteres)";
      showError(msg, "Campos inválidos");
      return;
    }

    try {
      setLoading(true);
      await cadastrarUsuario({ nome: nomeTrim, email: emailTrim, senha: senhaTrim });
      setLoading(false);
      setModal({
        visible: true,
        type: "success",
        title: "Conta criada",
        message: "Sua conta foi criada com sucesso!",
      });
    } catch (error) {
      setLoading(false);
      const msg = formatApiError(error, "cadastro");
      showError(msg);
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      {/* TOPO */}
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Registre-se</Text>
        <Text style={styles.subtitulo}>Crie uma conta para continuar!</Text>
      </View>

      {/* CARD */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* Nome */}
          <TextInput
            style={[styles.input, campoInvalido.nome && styles.inputErro]}
            placeholder="Nome completo"
            placeholderTextColor="#888"
            value={nome}
            underlineColorAndroid="transparent"
            onChangeText={(t) => {
              setNome(t);
              setCampoInvalido((p) => ({ ...p, nome: false }));
            }}
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* Email */}
          <TextInput
            style={[styles.input, campoInvalido.email && styles.inputErro]}
            placeholder="email@exemplo.com"
            placeholderTextColor="#888"
            value={email}
            underlineColorAndroid="transparent"
            onChangeText={(t) => {
              setEmail(t);
              setCampoInvalido((p) => ({ ...p, email: false }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          {/* Senha */}
          <View style={[styles.senhaContainer, campoInvalido.senha && styles.inputErro]}>
            <TextInput
              style={styles.inputSenha}
              placeholder="******"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarSenha}
              value={senha}
              underlineColorAndroid="transparent"
              onChangeText={(t) => {
                setSenha(t);
                setCampoInvalido((p) => ({ ...p, senha: false }));
              }}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleRegistrar}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha((v) => !v)}
              accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

          {/* Ação */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleRegistrar} disabled={loading}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.botaoGradiente, loading && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.botaoTexto}>Registre-se</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        
          {/* Ir para login */}
          <View style={styles.registroContainer}>
            <Text style={styles.registroTexto}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkRegistro}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal */}
      <StatusModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryText={modal.type === "success" ? "Ir para login" : "OK"}
        onPrimary={() => {
          setModal((m) => ({ ...m, visible: false }));
          if (modal.type === "success") {
            navigation.replace("Login", { emailPrefill: email });
          }
        }}
        onRequestClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </ImageBackground>
  );
}