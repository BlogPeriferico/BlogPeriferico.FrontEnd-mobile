import React, { useMemo, useState, useCallback } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { criarNoticia } from "../../services/noticias";
import { useRegionTheme } from "../../utils/regionTheme";
import RegionSelector from "../../components/RegionSelector";
import { useRegiao } from "../../contexts/RegionContext";

// Função para mapear a região para o enum do backend
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
    noroeste2: "NOROESTE2",
  };
  const key = String(regiao || "").toLowerCase();
  return map[key] || "CENTRO";
}

// Função para recuperar o token de autenticação
async function getAuthToken() {
  const keysToTry = [
    "@auth/token",
    "@auth_token",
    "@token",
    "token",
    "access_token",
  ];
  for (const k of keysToTry) {
    try {
      const v = await AsyncStorage.getItem(k);
      if (v) return v.replace(/^"(.*)"$/, "$1");
    } catch {}
  }
  return null;
}

export default function NovaNoticia({ navigation, route }) {
  const { colors } = useRegionTheme();
  const { regiao } = useRegiao();

  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [local, setLocal] = useState("");
  const [zona, setZona] = useState(mapRegiaoToEnum(regiao));
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regionModal, setRegionModal] = useState(false);

  // Estilo base do input
  const inputBaseStyle = useMemo(
    () => ({
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: "#111827",
    }),
    []
  );

  // Função para escolher uma imagem
  const escolherImagem = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de acesso às imagens.");
      return;
    }
    const hasNewAPI = !!ImagePicker?.MediaType;
    const pickerOptions = hasNewAPI
      ? { mediaTypes: [ImagePicker.MediaType.Images], quality: 0.9 }
      : { mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 };
    const res = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!res.canceled && res.assets?.length) {
      const a = res.assets[0];
      setImg({
        uri: a.uri,
        mimeType: a.mimeType || "image/jpeg",
        fileName: a.fileName || "upload.jpg",
      });
    }
  }, []);

  // Função para enviar a notícia
  const enviar = useCallback(async () => {
    if (!titulo.trim() || !texto.trim()) {
      Alert.alert("Campos obrigatórios", "Informe pelo menos título e descrição.");
      return;
    }
    try {
      setLoading(true);
      const tokenFromStorage = await getAuthToken();
      const token = tokenFromStorage || route?.params?.token || null;

      console.log("📤 [REQ] POST /noticias");
      console.log("   body(dto):", JSON.stringify({ titulo, texto, local, zona }));
      console.log("   hasFile:", Boolean(img?.uri));

      const resp = await criarNoticia({ titulo, texto, local, zona, imagemFile: img, token });
      console.log("✅ criada:", resp?.id ?? "(sem id)");
      Alert.alert("Sucesso", "Notícia criada!");
      navigation.goBack?.();
    } catch (e) {
      console.log("❌ criarNoticia:", e?.message || "erro");
      let msg = "Erro interno no servidor. Tente novamente mais tarde.";
      if (e?.message?.includes("401") || e?.message?.includes("403"))
        msg = "Sessão expirada ou sem permissão. Faça login novamente.";
      if (e?.message?.includes("userId")) msg = "Não foi possível identificar o usuário. Faça login novamente.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }, [titulo, texto, local, zona, img, route?.params?.token, navigation]);

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} activeOpacity={0.8} style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>◀ Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={escolherImagem}
            activeOpacity={0.85}
            style={{
              width: 160,
              height: 160,
              alignSelf: "center",
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 12,
              backgroundColor: colors.soft,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {img?.uri ? (
              <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
            ) : (
              <>
                <Text style={{ fontSize: 28, color: colors.primary, marginBottom: 6 }}>＋</Text>
                <Text style={{ color: "#9CA3AF" }}>Adicione uma imagem</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ backgroundColor: colors.soft, padding: 14 }}>
            <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Título</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
              placeholderTextColor="#9CA3AF"
              style={[inputBaseStyle, { borderRadius: 8, marginBottom: 12 }]}
            />

            <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Região</Text>
            <TouchableOpacity
              onPress={() => setRegionModal(true)}
              activeOpacity={0.85}
              style={[
                inputBaseStyle,
                { borderRadius: 8, marginBottom: 12, borderColor: colors.border, justifyContent: "center", height: 44 },
              ]}
            >
              <Text style={{ color: "#111827" }}>
                {zona === "NOROESTE2" ? "noroeste (2)" : String(zona).toLowerCase()}
              </Text>
            </TouchableOpacity>

            <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Descrição</Text>
            <TextInput
              value={texto}
              onChangeText={setTexto}
              placeholder="Digite a descrição"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={[inputBaseStyle, { minHeight: 120, borderRadius: 8, marginBottom: 18 }]}
            />

            <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Local (opcional)</Text>
            <TextInput
              value={local}
              onChangeText={setLocal}
              placeholder="Ex.: São Paulo, Centro"
              placeholderTextColor="#9CA3AF"
              style={[inputBaseStyle, { borderRadius: 8, marginBottom: 18 }]}
            />

            <TouchableOpacity
              onPress={enviar}
              disabled={loading}
              activeOpacity={0.9}
              style={{
                backgroundColor: loading ? "#9CA3AF" : colors.primary,
                height: 46,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                elevation: 2,
              }}
            >
              <Text style={{ color: colors.textOnPrimary, fontWeight: "700" }}>
                {loading ? "Adicionando..." : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegionSelector visible={regionModal} onClose={() => { setZona(mapRegiaoToEnum(regiao)); setRegionModal(false); }} />
    </>
  );
}
