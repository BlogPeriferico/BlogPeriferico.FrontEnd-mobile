import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/login/LoginStyles";
import Fundo from "../../assets/images/Fundo_login.png";
import { solicitarCodigo } from "../../services/auth";
import StatusModal from "../../components/ui/StatusModal";
import { formatApiError } from "../../utils/formatApiError";

export default function EsqueciSenhaEmail({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info", title: "", message: "" });

  const validarEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(e?.trim());
  const showError = (m, t="Não foi possível enviar") => setModal({ visible: true, type: "error", title: t, message: m });

  const handleEnviar = async () => {
    const emailTrim = email.trim();
    if (!validarEmail(emailTrim)) {
      showError("Digite um e-mail válido.", "Atenção");
      return;
    }
    try {
      setLoading(true);
      await solicitarCodigo({ email: emailTrim });
      setLoading(false);
      setModal({
        visible: true,
        type: "success",
        title: "Código enviado",
        message: "Enviamos um código de 6 dígitos para o seu e-mail.",
      });
    } catch (err) {
      setLoading(false);
      const msg = formatApiError(err, "recovery-send");
      showError(msg);
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Esqueci minha senha</Text>
        <Text style={styles.subtitulo}>Coloque seu e-mail de recuperação</Text>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={handleEnviar}
          />

          <Text style={{ color: "#666", marginTop: 8, marginBottom: 16 }}>
            Enviaremos um código de 6 dígitos para o e-mail acima
          </Text>

          <TouchableOpacity activeOpacity={0.9} onPress={handleEnviar} disabled={loading}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.botaoGradiente, loading && { opacity: 0.7 }]}
            >
              {loading ? <ActivityIndicator size="small" /> : <Text style={styles.botaoTexto}>Enviar código</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.navigate("Login")}>
            <Text style={{ textAlign: "center", color: "#888" }}>Logue para continuar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryText={modal.type === "success" ? "Colocar código" : "OK"}
        onPrimary={() => {
          setModal((m) => ({ ...m, visible: false }));
          if (modal.type === "success") {
            navigation.navigate("EsqueciSenhaCodigo", { email: email.trim() });
          }
        }}
        onRequestClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </ImageBackground>
  );
}
