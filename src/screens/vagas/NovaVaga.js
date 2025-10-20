import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { criarVaga } from "../../services/vagas";
import { useRegionTheme } from "../../utils/regionTheme";
import RegionSelector from "../../components/RegionSelector";
import { useRegiao } from "../../contexts/RegionContext";
import PhoneInputBR from "../../components/PhoneInputBR";

function mapRegiaoToEnum(regiao) {
  const map = {
    centro: "CENTRO",
    norte: "NORTE",
    sul: "SUL",
    leste: "LESTE",
    oeste: "OESTE",
    sudoeste: "SUDOESTE",
    sudeste: "SUDESTE",
    noroeste: "NOROESTE",
  };
  const key = String(regiao || "").toLowerCase();
  return map[key] || "CENTRO";
}

function inferNameByUri(uri = "") {
  try {
    const p = uri.split("?")[0];
    return p.substring(p.lastIndexOf("/") + 1) || null;
  } catch {
    return null;
  }
}
function inferMimeByUri(uri = "") {
  const n = (uri || "").toLowerCase();
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".webp")) return "image/webp";
  return null;
}

export default function NovaVaga({ navigation }) {
  const { colors } = useRegionTheme();
  const { regiao } = useRegiao();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telValido, setTelValido] = useState(false);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regionModal, setRegionModal] = useState(false);

  const escolherImagem = useCallback(async () => {
    try {
      const cur = await ImagePicker.getMediaLibraryPermissionsAsync();
      let status = cur?.status;
      if (status !== "granted") {
        const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = req?.status;
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Precisamos de acesso às suas fotos para selecionar a imagem.",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Abrir configurações", onPress: () => Linking.openSettings?.() },
            ]
          );
          return;
        }
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });
      if (!res || res.canceled) return;

      const a = res.assets?.[0];
      if (!a?.uri) {
        Alert.alert("Ops", "Não foi possível obter a imagem selecionada.");
        return;
      }

      const name = a.fileName || inferNameByUri(a.uri) || `vaga_${Date.now()}.jpg`;
      const mime = a.mimeType || inferMimeByUri(a.uri) || "image/jpeg";
      setImg({ uri: a.uri, fileName: name, mimeType: mime });
    } catch (e) {
      Alert.alert("Erro", "Falha ao abrir suas fotos. Tente novamente.");
    }
  }, []);

  const enviar = useCallback(async () => {
    if (loading) return;
    if (!titulo.trim() || !descricao.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha título e descrição.");
      return;
    }
    if (!telValido) {
      Alert.alert("Telefone inválido", "Informe um telefone válido.");
      return;
    }
    try {
      setLoading(true);
      await criarVaga({
        titulo,
        descricao,
        telefone,
        zona: mapRegiaoToEnum(regiao),
        imagemFile: img,
      });
      Alert.alert("Sucesso", "Vaga criada!");
      navigation.goBack?.();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar a vaga.");
    } finally {
      setLoading(false);
    }
  }, [loading, titulo, descricao, telefone, telValido, regiao, img, navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "#FAFAFA" }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Voltar */}
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.8}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: colors.primary, fontWeight: "600", marginTop: 30 }}>
              ◀ Voltar
            </Text>
          </TouchableOpacity>

          {/* Imagem */}
          <TouchableOpacity
            onPress={escolherImagem}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.85}
            style={{
              width: 160,
              height: 160,
              alignSelf: "center",
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 12,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            {img?.uri ? (
              <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
            ) : (
              <Text style={{ color: "#9CA3AF" }}>Adicione uma imagem</Text>
            )}
          </TouchableOpacity>

          {/* Formulário */}
          <View style={{ padding: 4 }}>
            {/* Título */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Título
            </Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título da vaga"
              placeholderTextColor={colors.border}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 6,
                marginBottom: 12,
                color: "#111827",
              }}
            />

            {/* Região (igual ao de doação) */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Região
            </Text>
            <TouchableOpacity
              onPress={() => setRegionModal(true)}
              activeOpacity={0.85}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 6,
                marginBottom: 12,
                justifyContent: "center",
                height: 44,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ color: "#111827" }}>{String(regiao).toLowerCase()}</Text>
            </TouchableOpacity>

            {/* Contato */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Contato
            </Text>
            <PhoneInputBR
              value={telefone}
              onChangeRaw={setTelefone}
              onValidChange={setTelValido}
              colors={colors}
              placeholder="(11) 99999-9999"
            />

            {/* Descrição */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Descrição
            </Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição da vaga"
              placeholderTextColor={colors.border}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 120,
                marginBottom: 18,
                color: "#111827",
              }}
            />

            {/* Botão */}
            <TouchableOpacity
              onPress={enviar}
              disabled={loading || !telValido}
              activeOpacity={0.9}
              style={{
                backgroundColor: loading || !telValido ? colors.border : colors.primary,
                height: 46,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.textOnPrimary, fontWeight: "600" }}>
                {loading ? "Adicionando..." : "Publicar vaga"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de seleção de região (controla o contexto) */}
      <RegionSelector visible={regionModal} onClose={() => setRegionModal(false)} />
    </>
  );
}
