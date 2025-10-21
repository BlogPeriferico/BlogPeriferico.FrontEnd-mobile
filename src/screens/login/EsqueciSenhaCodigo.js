import React, { useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/login/LoginStyles";
import Fundo from "../../assets/images/Fundo_login.png";
import CloseEye from "../../assets/svgs/Close_Eye.svg";
import OpenEye from "../../assets/svgs/Open_Eye.svg";
import { confirmarCodigoENovaSenha } from "../../services/auth";
import StatusModal from "../../components/ui/StatusModal";
import { formatApiError } from "../../utils/formatApiError";

export default function EsqueciSenhaCodigo({ route, navigation }) {
  const email = route?.params?.email ?? "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputs = Array.from({ length: 6 }).map(() => useRef(null));

  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info", title: "", message: "" });

  const showError = (m, t = "Não foi possível alterar") =>
    setModal({ visible: true, type: "error", title: t, message: m });

  const handleChangeDigit = (idx, val) => {
    const only = (val || "").replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = only;
    setDigits(next);
    if (only && idx < 5) inputs[idx + 1].current?.focus();
    if (!only && idx > 0) inputs[idx - 1].current?.focus();
  };

  const codigo = digits.join("");

  const handleConfirmar = async () => {
    console.log("🔵 [ESQ-COD] confirmar", { email, codigoLen: codigo.length });

    if (!email) {
      console.log("🟠 [ESQ-COD] email ausente");
      showError("E-mail não encontrado. Volte e preencha o e-mail.", "Atenção");
      return;
    }
    if (codigo.length !== 6) {
      console.log("🟠 [ESQ-COD] código inválido:", codigo);
      showError("Digite o código de 6 dígitos.", "Atenção");
      return;
    }
    if (!senha || senha.length < 6) {
      console.log("🟠 [ESQ-COD] senha curta");
      showError("A nova senha deve ter no mínimo 6 caracteres.", "Atenção");
      return;
    }
    if (senha !== confirma) {
      console.log("🟠 [ESQ-COD] senhas diferentes");
      showError("As senhas não coincidem.", "Atenção");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 [ESQ-COD] chamando confirmarCodigoENovaSenha", { email, codigo, novaSenhaLen: senha.length });
      await confirmarCodigoENovaSenha({ email, codigo, novaSenha: senha });
      console.log("✅ [ESQ-COD] senha alterada OK");
      setModal({
        visible: true,
        type: "success",
        title: "Senha alterada!",
        message: "Faça login novamente com sua nova senha.",
      });
    } catch (err) {
      const msg = formatApiError(err, "recovery-confirm");
      console.log("❌ [ESQ-COD] erro ao confirmar:", {
        message: err?.message,
        status: err?.status,
        details: err,
      });
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={Fundo} style={styles.background} resizeMode="cover">
      <View style={styles.headerTop}>
        <Text style={styles.titulo}>Código de recuperação</Text>
        <Text style={styles.subtitulo}>Digite o código que enviamos e crie uma nova senha</Text>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* OTP */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={inputs[i]}
                style={[
                  styles.input,
                  {
                    width: 44,
                    height: 56,
                    textAlign: "center",
                    fontSize: 22,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    marginHorizontal: 2,
                  },
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={d}
                onChangeText={(t) => handleChangeDigit(i, t)}
                returnKeyType="next"
              />
            ))}
          </View>

          {/* Nova senha */}
          <View style={[styles.senhaContainer, { marginBottom: 12 }]}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Coloque sua nova senha"
              placeholderTextColor="#888"
              secureTextEntry={!show1}
              value={senha}
              onChangeText={setSenha}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShow1((v) => !v)}>
              {show1 ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

          {/* Confirmar senha */}
          <View style={[styles.senhaContainer, { marginBottom: 16 }]}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Confirme sua nova senha"
              placeholderTextColor="#888"
              secureTextEntry={!show2}
              value={confirma}
              onChangeText={setConfirma}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleConfirmar}
            />
            <TouchableOpacity onPress={() => setShow2((v) => !v)}>
              {show2 ? <OpenEye width={24} height={24} /> : <CloseEye width={24} height={24} />}
            </TouchableOpacity>
          </View>

          {/* Botão */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleConfirmar} disabled={loading}>
            <LinearGradient
              colors={["#9B9B9B", "#6F6F6F"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.botaoGradiente, loading && { opacity: 0.7 }]}
            >
              {loading ? <ActivityIndicator size="small" /> : <Text style={styles.botaoTexto}>Confirmar</Text>}
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
