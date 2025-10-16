import React, { useMemo, useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const onlyDigits = (s = "") => (s || "").replace(/\D+/g, "");


const formatBRPhone = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  const len = d.length;
  if (len === 0) return "";

  if (len <= 2) return `(${d}`; 

  const out = `(${d.slice(0, 2)}) `;
  const rest = d.slice(2);

  if (len <= 6) return out + rest; 

  if (len <= 10) return out + rest.slice(0, 4) + "-" + rest.slice(4);

  return out + rest.slice(0, 5) + "-" + rest.slice(5);
};

const isValidBRPhone = (v) => {
  const n = onlyDigits(v).length;
  return n === 10 || n === 11;
};

export default function PhoneInputBR({
  value = "",
  onChangeRaw,
  onValidChange,
  placeholder = "(11) 99999-9999",
  colors = { primary: "#7C3AED", border: "#9CA3AF" },
  style,
}) {
  const [digits, setDigits] = useState(onlyDigits(value));

  useEffect(() => {
    setDigits(onlyDigits(value));
  }, [value]);

  const formatted = useMemo(() => formatBRPhone(digits), [digits]);
  const valid = useMemo(() => isValidBRPhone(digits), [digits]);

  useEffect(() => {
    onValidChange?.(valid);
  }, [valid, onValidChange]);

  const showError = digits.length > 0 && !valid;
  const borderColor = showError ? "#DC2626" : colors.primary;

  return (
    <View style={{ width: "100%" }}>
      <View style={{ position: "relative", justifyContent: "center" }}>
        <TextInput
          value={formatted}
          onChangeText={(txt) => {
            const d = onlyDigits(txt);
            setDigits(d);
            onChangeRaw?.(d);
          }}
          placeholder={placeholder}
          keyboardType="phone-pad"
          inputMode="tel"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={16} 
          placeholderTextColor={colors.border}
          cursorColor={colors.primary}
          selectionColor={colors.primary + "55"}
          returnKeyType="done"
          style={{
            backgroundColor: "#fff",
            borderWidth: 1.5,
            borderColor: borderColor,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 10,
            marginBottom: 6,
            color: "#111827",
            fontSize: 16,
            elevation: 1,
            ...style,
          }}
        />

        {digits.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setDigits("");
              onChangeRaw?.("");
            }}
            accessibilityLabel="Limpar telefone"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center", 
              paddingHorizontal: 6,
            }}
          >
            <Text style={{ fontSize: 16, color: borderColor }}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {showError ? (
        <Text style={{ color: "#DC2626", fontSize: 12 }}>
          Digite um telefone válido (10 ou 11 dígitos).
        </Text>
      ) : (
        <Text style={{ color: "#6B7280", fontSize: 12 }}>
        </Text>
      )}
    </View>
  );
}
