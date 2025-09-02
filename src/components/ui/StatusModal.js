import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function StatusModal({
  visible,
  type = "info",            // 'success' | 'error' | 'info'
  title = "",
  message = "",
  primaryText = "OK",
  onPrimary = () => {},
  secondaryText,
  onSecondary,
  onRequestClose = () => {},
}) {
  const palette = {
    success: { bg: ["#37D17F", "#2FA966"], ring: "#CFF6E0", text: "#103E2A", icon: "✅" },
    error:   { bg: ["#F06E6E", "#B83B3B"], ring: "#FAD7D7", text: "#3E1010", icon: "❌" },
    info:    { bg: ["#9B9B9B", "#6F6F6F"], ring: "#E7E7E7", text: "#1E1E1E", icon: "ℹ️" },
  }[type] || {};

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable
        onPress={onRequestClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 24 }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: "#FFFFFFEE",
            borderRadius: 16,
            padding: 18,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: palette.ring,
                alignItems: "center", justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 34 }}>{palette.icon}</Text>
            </View>
            {!!title && (
              <Text style={{ fontSize: 20, fontWeight: "700", color: palette.text, textAlign: "center" }}>
                {title}
              </Text>
            )}
          </View>

          {!!message && (
            <Text style={{ color: "#4A4A4A", textAlign: "center", lineHeight: 20, marginBottom: 16 }}>
              {message}
            </Text>
          )}

          <View style={{ gap: 10 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPrimary}>
              <LinearGradient
                colors={palette.bg}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>{primaryText}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {secondaryText && onSecondary && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSecondary}
                style={{
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#D9D9D9",
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ color: "#333", fontWeight: "600" }}>{secondaryText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
