import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import CloseEye from "../../assets/svgs/Close_Eye.svg";
import OpenEye from "../../assets/svgs/Open_Eye.svg";
import api from "../../api/api";
import { styles } from "../../styles/login/LoginStyles"; // reuso dos estilos
import Fundo from "../../assets/images/Fundo_login.png";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [campoInvalido, setCampoInvalido] = useState({
    nome: false,
    email: false,
    senha: false,
  });

  const validarEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);

  const handleRegistrar = async () => {
    if (!nome || !email || !senha) {
      setCampoInvalido({
        nome: !nome,
        email: !email,
        senha: !senha,
      });
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    if (!validarEmail(email)) {
      setCampoInvalido((p) => ({ ...p, email: true }));
      Alert.alert("Erro", "Digite um e-mail válido!");
      return;
    }

    try {
      // 🔧 Ajuste o endpoint conforme seu back-end
      await api.post("/usuario/cadastro", { nome, email, senha });
      Alert.alert("Cadastro", "Conta criada com sucesso!");
      navigation.navigate("Noticias");
    } catch (error) {
      Alert.alert("Erro", error.response?.data || "Erro no cadastro");
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      {/* TOPO (fora do card) */}
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Registre-se</Text>
        <Text style={styles.subtitulo}>Crie uma conta para continuar!</Text>
      </View>

      {/* CARD */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <TextInput
            style={[styles.input, campoInvalido.nome && styles.inputErro]}
            placeholder="Pedro Pimentinha"
            placeholderTextColor="#888"
            value={nome}
            underlineColorAndroid="transparent"
            onChangeText={(t) => {
              setNome(t);
              setCampoInvalido((p) => ({ ...p, nome: false }));
            }}
          />

          <TextInput
            style={[styles.input, campoInvalido.email && styles.inputErro]}
            placeholder="Geladeirapimentinha@gmail.com"
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
              placeholder="******"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarSenha}
              value={senha}
              underlineColorAndroid="transparent"
              onChangeText={(t) => {
                setSenha(t);
                setCampoInvalido((p) => ({ ...p, senha: false }));
              }}
            />
            <TouchableOpacity onPress={() => setMostrarSenha((v) => !v)}>
              {mostrarSenha ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

          {/* Botão principal */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleRegistrar}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.botaoGradiente}
            >
              <Text style={styles.botaoTexto}>Registre-se</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider OU com linhas */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Visitante */}
          <TouchableOpacity
            style={styles.visitorButton}
            onPress={() => navigation.navigate("Noticias")}
          >
            <Text style={styles.visitorText}>Entrar como visitante</Text>
          </TouchableOpacity>

          {/* Rodapé dentro do card */}
          <View style={styles.registroContainer}>
            <Text style={styles.registroTexto}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkRegistro}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
