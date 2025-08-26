import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CloseEye from "../../assets/svgs/Close_Eye.svg";
import OpenEye from "../../assets/svgs/Open_Eye.svg";
import api from "../../api/api";
import { styles } from "../../styles/login/LoginStyles";
import Fundo from "../../assets/images/Fundo_login.png";

const STORAGE_KEYS = {
  LEMBRAR: "@login/lembrar",
  EMAIL: "@login/email",
};

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [campoInvalido, setCampoInvalido] = useState({ email: false, senha: false });

  const alternarVisibilidadeSenha = () => setMostrarSenha(!mostrarSenha);
  const validarEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);

  useEffect(() => {
    (async () => {
      try {
        const savedLembrar = await AsyncStorage.getItem(STORAGE_KEYS.LEMBRAR);
        const lembrarBool = savedLembrar === "true";
        setLembrar(lembrarBool);
        if (lembrarBool) {
          const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
          if (savedEmail) setEmail(savedEmail);
        }
      } catch {}
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      setCampoInvalido({ email: !email, senha: !senha });
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    if (!validarEmail(email)) {
      setCampoInvalido({ email: true, senha: false });
      Alert.alert("Erro", "Digite um e-mail válido!");
      return;
    }
    try {
      await api.post("/usuario/login", { email, senha });
      if (lembrar) {
        await AsyncStorage.setItem(STORAGE_KEYS.LEMBRAR, "true");
        await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, email);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.LEMBRAR);
        await AsyncStorage.removeItem(STORAGE_KEYS.EMAIL);
      }
      navigation.navigate("Noticias");
    } catch (error) {
      Alert.alert("Erro", error.response?.data || "Erro no login");
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      {/* TOPO */}
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Login</Text>
        <Text style={styles.subtitulo}>Entre com seu email e sua senha</Text>
      </View>

      {/* CARD (sem sombras no Android) */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
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
          />

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
            />
            <TouchableOpacity onPress={alternarVisibilidadeSenha}>
              {mostrarSenha ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

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

            <TouchableOpacity>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={handleLogin}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.botaoGradiente}
            >
              <Text style={styles.botaoTexto}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* OU com linhas */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.visitorButton} onPress={() => navigation.navigate("Noticias")}>
            <Text style={styles.visitorText}>Entrar como visitante</Text>
          </TouchableOpacity>

          <View style={styles.registroContainer}>
            <Text style={styles.registroTexto}>Não tem uma conta ainda? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={styles.linkRegistro}>Registre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Logue para continuar</Text>
    </ImageBackground>
  );
}
