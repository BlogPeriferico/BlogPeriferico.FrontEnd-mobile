import React, { useState, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Alert,
  ScrollView, KeyboardAvoidingView, Platform, Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { criarVenda } from "../../services/vendas";
import { useRegionTheme } from "../../utils/regionTheme";
import RegionSelector from "../../components/RegionSelector";
import { useRegiao } from "../../contexts/RegionContext";
import PhoneInputBR from "../../components/PhoneInputBR";
import CPFInputBR from "../../components/CPFInputBR";
import { listComentariosVenda, criarComentarioVenda } from "../../services/comentarios";
import MoneyInputBR from "../../components/MoneyInputBR";

function mapRegiaoToEnum(regiao) {
  const map = {
    centro: "CENTRO", norte: "NORTE", sul: "SUL", leste: "LESTE", oeste: "OESTE",
    sudoeste: "SUDOESTE", sudeste: "SUDESTE", noroeste: "NOROESTE",
  };
  const key = String(regiao || "").toLowerCase();
  return map[key] || "CENTRO";
}

function inferNameByUri(uri = "") {
  try { const p = uri.split("?")[0]; return p.substring(p.lastIndexOf("/") + 1) || null; } catch { return null; }
}
function inferMimeByUri(uri = "") {
  const n = (uri || "").toLowerCase();
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".webp")) return "image/webp";
  return null;
}

export default function NovaVenda({ navigation }) {
  const { colors } = useRegionTheme();
  const { regiao } = useRegiao();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telValido, setTelValido] = useState(false);

  const [cpf, setCpf] = useState("");             
  const [cpfValido, setCpfValido] = useState(false);

  const [valor, setValor] = useState("");          
  const [valorValido, setValorValido] = useState(false);

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
      if (!a?.uri) { Alert.alert("Ops", "Não foi possível obter a imagem selecionada."); return; }
      const name = a.fileName || inferNameByUri(a.uri) || `venda_${Date.now()}.jpg`;
      const mime = a.mimeType || inferMimeByUri(a.uri) || "image/jpeg";
      setImg({ uri: a.uri, fileName: name, mimeType: mime });
    } catch {
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
    if (!cpfValido) {
      Alert.alert("CPF inválido", "Informe um CPF válido.");
      return;
    }
    if (!valorValido) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }

    try {
      setLoading(true);
      await criarVenda({
        titulo,
        descricao,
        telefone,
        cpf, // só dígitos (CPFInputBR garante)
        zona: mapRegiaoToEnum(regiao),
        valor, // number em reais (ex.: 1234.56)
        imagemFile: img,
      });
      Alert.alert("Sucesso", "Venda criada!");
      navigation.goBack?.();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar a venda.");
    } finally {
      setLoading(false);
    }
  }, [loading, titulo, descricao, telefone, telValido, cpf, cpfValido, valor, valorValido, regiao, img, navigation]);

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} activeOpacity={0.8} style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: "600", marginTop: 30 }}>◀ Voltar</Text>
          </TouchableOpacity>

          {/* Imagem */}
          <TouchableOpacity
            onPress={escolherImagem}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.85}
            style={{
              width: 160, height: 160, alignSelf: "center",
              borderWidth: 2, borderColor: colors.primary, borderRadius: 12, backgroundColor: "#fff",
              alignItems: "center", justifyContent: "center", marginTop: 10, marginBottom: 16,
            }}
          >
            {img?.uri ? (
              <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
            ) : (
              <Text style={{ color: "#9CA3AF" }}>Adicione uma imagem</Text>
            )}
          </TouchableOpacity>

          {/* Form */}
          <View style={{ padding: 4 }}>
            {/* Título */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>Título</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título"
              placeholderTextColor={colors.border}
              style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, marginBottom: 12, color: "#111827" }}
            />

            {/* Região */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>Região</Text>
            <TouchableOpacity
              onPress={() => setRegionModal(true)}
              activeOpacity={0.85}
              style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: colors.primary, borderRadius: 6, marginBottom: 12, justifyContent: "center", height: 44, paddingHorizontal: 12 }}
            >
              <Text style={{ color: "#111827" }}>{String(regiao).toLowerCase()}</Text>
            </TouchableOpacity>

            {/* Telefone */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>Telefone</Text>
            <PhoneInputBR
              value={telefone}
              onChangeRaw={setTelefone}
              onValidChange={setTelValido}
              colors={colors}
              placeholder="(11) 99999-9999"
            />

            {/* CPF */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>CPF</Text>
            <CPFInputBR
              value={cpf}
              onChangeRaw={setCpf}
              onValidChange={setCpfValido}
              colors={colors}
            />

            {/* Valor */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>Valor</Text>
            <MoneyInputBR
              value={valor}
              onChangeRaw={setValor}          // número em reais
              onValidChange={setValorValido}
              colors={colors}
              showErrorText={false}
              // min={0.01} // se quiser obrigar mínimo de 1 centavo
            />

            {/* Descrição */}
            <Text style={{ fontWeight: "600", color: colors.primary, marginBottom: 6 }}>Descrição</Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição do produto"
              placeholderTextColor={colors.border}
              multiline numberOfLines={6} textAlignVertical="top"
              style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, minHeight: 120, marginBottom: 18, color: "#111827" }}
            />

            {/* Botão */}
            <TouchableOpacity
              onPress={enviar}
              disabled={loading || !telValido || !cpfValido || !valorValido}
              activeOpacity={0.9}
              style={{
                backgroundColor: (loading || !telValido || !cpfValido || !valorValido) ? colors.border : colors.primary,
                height: 46, alignItems: "center", justifyContent: "center", borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {loading ? "Publicando..." : "Publicar venda"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegionSelector visible={regionModal} onClose={() => setRegionModal(false)} />
    </>
  );

  
}
