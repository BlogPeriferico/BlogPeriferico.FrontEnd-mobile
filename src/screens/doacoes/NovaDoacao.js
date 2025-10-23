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
import { criarDoacao } from "../../services/doacoes";
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

// helpers para inferir nome/mime quando a plataforma não fornece
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

export default function NovaDoacao({ navigation }) {
  const { colors } = useRegionTheme();
  const { regiao } = useRegiao(); // <- única fonte de verdade

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [telefone, setTelefone] = useState("");  // só dígitos
  const [telValido, setTelValido] = useState(false);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regionModal, setRegionModal] = useState(false);

  // Escolher imagem
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

      const hasNew = !!ImagePicker?.MediaType;
      const options = hasNew
        ? { mediaTypes: ImagePicker.MediaType.Images, quality: 0.9, allowsEditing: true }
        : { mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? undefined, quality: 0.9, allowsEditing: true };

      const res = await ImagePicker.launchImageLibraryAsync(options);
      if (!res || res.canceled) return;

      const a = res.assets?.[0];
      if (!a?.uri) {
        Alert.alert("Ops", "Não foi possível obter a imagem selecionada.");
        return;
      }

      const name = a.fileName || inferNameByUri(a.uri) || `upload_${Date.now()}.jpg`;
      const mime = a.mimeType || inferMimeByUri(a.uri) || "image/jpeg";
      setImg({ uri: a.uri, fileName: name, mimeType: mime });
    } catch (e) {
      Alert.alert("Erro", "Falha ao abrir suas fotos. Tente novamente.");
    }
  }, []);

  // Enviar doação
  const enviar = useCallback(async () => {
    if (loading) return;
    if (!titulo.trim() || !descricao.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha título e descrição.");
      return;
    }
    if (!telValido) {
      Alert.alert("Telefone inválido", "Informe um telefone com DDD (10 ou 11 dígitos).");
      return;
    }
    try {
      setLoading(true);
      await criarDoacao({
        titulo,
        descricao,
        telefone,
        zona: mapRegiaoToEnum(regiao), // <- mapeia NA HORA de enviar
        imagemFile: img,
      });
      Alert.alert("Sucesso", "Doação criada!");
      navigation.goBack?.();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar a doação.");
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
              <Image
                source={{ uri: img.uri }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            ) : (
              <>
                <Image
                  source={require("../../assets/gifs/add.gif")}
                  style={{ width: 60, height: 60, marginBottom: 6 }}
                />
                <Text style={{ color: "#9CA3AF" }}>Adicione uma imagem</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Formulário */}
          <View style={{ padding: 4 }}>
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Título
            </Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
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

            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Região
            </Text>
            {/* Exibe SEM state local; abre o modal para selecionar */}
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

            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Descrição
            </Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite a descrição"
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
                {loading ? "Adicionando..." : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de seleção de região */}
      <RegionSelector
        visible={regionModal}
        onClose={() => setRegionModal(false)} // <- só fecha; o valor vem do contexto
      />
    </>
  );
}
