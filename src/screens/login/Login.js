import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { resetToMain } from "../../navigation/navigationRef";

import CloseEye from "../../assets/svgs/Close_Eye.svg";
import OpenEye from "../../assets/svgs/Open_Eye.svg";
import { styles } from "../../styles/login/LoginStyles";
import Fundo from "../../assets/images/Fundo_login.png";

import { login } from "../../services/auth";
import StatusModal from "../../components/ui/StatusModal";
import { formatApiError } from "../../utils/formatApiError";

const STORAGE_KEYS = { LEMBRAR: "@login/lembrar", EMAIL: "@login/email" };

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.emailPrefill ?? "");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [campoInvalido, setCampoInvalido] = useState({ email: false, senha: false });
  const [modal, setModal] = useState({ visible: false, type: "info", title: "", message: "" });
  const [autenticando, setAutenticando] = useState(false);

  const alternarVisibilidadeSenha = () => setMostrarSenha((v) => !v);
  const validarEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(e).toLowerCase());
  const showError = (message, title = "Não foi possível entrar") =>
    setModal({ visible: true, type: "error", title, message });

  useEffect(() => {
    (async () => {
      try {
        const savedLembrar = await AsyncStorage.getItem(STORAGE_KEYS.LEMBRAR);
        const lembrarBool = savedLembrar === "true";
        setLembrar(lembrarBool);
        if (lembrarBool && !email) {
          const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
          if (savedEmail) setEmail(savedEmail);
        }
      } catch {}
    })();
  }, []);

  const handleLogin = async () => {
    const emailTrim = String(email).trim();
    if (autenticando) return;

    if (!emailTrim || !senha) {
      setCampoInvalido({ email: !emailTrim, senha: !senha });
      showError("Preencha todos os campos!");
      return;
    }
    if (!validarEmail(emailTrim)) {
      setCampoInvalido({ email: true, senha: false });
      showError("Digite um e-mail válido!");
      return;
    }

    try {
      setAutenticando(true);
      await login({ email: emailTrim, senha });

      if (lembrar) {
        await AsyncStorage.setItem(STORAGE_KEYS.LEMBRAR, "true");
        await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, emailTrim);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.LEMBRAR);
        await AsyncStorage.removeItem(STORAGE_KEYS.EMAIL);
      }

      // ✅ Ir para as tabs (root) via ref global
      resetToMain(); // abre na aba inicial (NoticiasTab)

      // 👉 Para abrir direto na aba de Doações:
      // resetToMain({ screen: "DoacoesTab", params: { screen: "DoacoesHome" } });

    } catch (error) {
      const msg = formatApiError(error, "login");
      showError(msg);
    } finally {
      setAutenticando(false);
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      {/* TOPO */}
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Login</Text>
        <Text style={styles.subtitulo}>Entre com seu email e sua senha</Text>
      </View>

      {/* CARD */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* Email */}
          <TextInput
            style={[styles.input, campoInvalido.email && styles.inputErro]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            underlineColorAndroid="transparent"
            onChangeText={(t) => {
              setEmail(t);
              setCampoInvalido((p) => ({ ...p, email: false }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          {/* Senha */}
          <View style={[styles.senhaContainer, campoInvalido.senha && styles.inputErro]}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Senha"
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
              onSubmitEditing={handleLogin}
              textContentType="password"
            />
            <TouchableOpacity onPress={alternarVisibilidadeSenha} accessibilityRole="button">
              {mostrarSenha ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

          {/* Lembre-me / Esqueci */}
          <View style={styles.linhaLembrete}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setLembrar((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBase, lembrar && styles.checkboxMarcado]}>
                {lembrar && <Text style={styles.checkboxIcon}>✓</Text>}
              </View>
              <Text style={styles.checkboxTexto}>Lembre me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("EsqueciSenhaEmail")}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          {/* Ação */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleLogin} disabled={autenticando}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.botaoGradiente, autenticando && { opacity: 0.7 }]}
            >
              <Text style={styles.botaoTexto}>{autenticando ? "Entrando..." : "Login"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Cadastro */}
          <View style={styles.registroContainer}>
            <Text style={styles.registroTexto}>Não tem uma conta ainda? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={styles.linkRegistro}>Registre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Logue para continuar</Text>

      <StatusModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryText="OK"
        onPrimary={() => setModal((m) => ({ ...m, visible: false }))}
        onRequestClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </ImageBackground>
  );
}
