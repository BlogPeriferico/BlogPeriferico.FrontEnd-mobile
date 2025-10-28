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

//  Mapear nome da região 
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

//  Recuperar token de autenticação
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

  //  Escolher imagem
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

  //  Enviar notícia
  const enviar = useCallback(async () => {
    if (!titulo.trim() || !texto.trim()) {
      Alert.alert("Campos obrigatórios", "Informe pelo menos título e descrição.");
      return;
    }
    try {
      setLoading(true);
      const tokenFromStorage = await getAuthToken();
      const token = tokenFromStorage || route?.params?.token || null;

      console.log(" [REQ] POST /noticias");
      console.log("   body(dto):", JSON.stringify({ titulo, texto, local, zona }));
      console.log("   hasFile:", Boolean(img?.uri));

      const resp = await criarNoticia({
        titulo,
        texto,
        local,
        zona,
        imagemFile: img,
        token,
      });
      console.log(" criada:", resp?.id ?? "(sem id)");
      Alert.alert("Sucesso", "Notícia criada!");
      navigation.goBack?.();
    } catch (e) {
      console.log(" criarNoticia:", e?.message || "erro");
      let msg = "Erro interno no servidor. Tente novamente mais tarde.";
      if (e?.message?.includes("401") || e?.message?.includes("403"))
        msg = "Sessão expirada ou sem permissão. Faça login novamente.";
      if (e?.message?.includes("userId"))
        msg = "Não foi possível identificar o usuário. Faça login novamente.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }, [titulo, texto, local, zona, img, route?.params?.token, navigation]);

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
            <Text style={{ color: colors.primary, fontWeight: "600", marginTop: 30}}>
              ◀ Voltar
            </Text>
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

          {/*  Formulário */}
          <View style={{ padding: 4, marginTop: 15}}>
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
              <Text style={{ color: "#111827" }}>
                {zona === "NOROESTE2" ? "noroeste (2)" : String(zona).toLowerCase()}
              </Text>
            </TouchableOpacity>

            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Descrição
            </Text>
            <TextInput
              value={texto}
              onChangeText={setTexto}
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

            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
              Local (opcional)
            </Text>
            <TextInput
              value={local}
              onChangeText={setLocal}
              placeholder="Ex.: São Paulo, Centro"
              placeholderTextColor={colors.border}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 6,
                marginBottom: 18,
                color: "#111827",
              }}
            />

            {/*  Botão de envio */}
            <TouchableOpacity
              onPress={enviar}
              disabled={loading}
              activeOpacity={0.9}
              style={{
                backgroundColor: loading ? colors.border : colors.primary,
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

      {/*  Modal de seleção de região */}
      <RegionSelector
        visible={regionModal}
        onClose={() => {
          setZona(mapRegiaoToEnum(regiao));
          setRegionModal(false);
        }}
      />
    </>
  );
}
