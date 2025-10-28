import React, { useMemo, useCallback, useState, useEffect } from "react";
import { TextInput, View, Text } from "react-native";

const onlyDigits = (s = "") => String(s).replace(/\D/g, "").slice(0, 12); // até trilhões (ajuste se quiser)

function centsToMaskedBRL(cents) {
  const i = Math.max(0, Number.isFinite(cents) ? cents : 0);
  const str = String(i).padStart(3, "0"); // garante pelo menos 3 dígitos
  const intPart = str.slice(0, -2);
  const decPart = str.slice(-2);
  // milhar com pontos
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decPart}`;
}

function maskedToCents(masked = "") {
  // aceita "1.234,56" ou "1234,56" ou "123456" etc.
  const digits = onlyDigits(masked);
  if (!digits) return 0;
  // últimos 2 dígitos são centavos
  if (digits.length === 1) return Number(digits) * 1; // "5" -> 0,05
  if (digits.length === 2) return Number(digits);     // "56" -> 0,56
  return Number(digits.slice(0, -2)) * 100 + Number(digits.slice(-2));
}

export default function MoneyInputBR({
  value,              // número em reais (ex.: 1234.56) ou string
  onChangeRaw,        // recebe número em reais (ex.: 1234.56)
  onValidChange,      // boolean (valor > 0)
  colors = {},
  placeholder = "0,00",
  style,
  inputProps = {},
  min = 0,
  max,                // opcional
  disabled = false,
  showErrorText = false,
}) {
  // estado interno em CENTAVOS (number)
  const initialCents = useMemo(() => {
    const n = Number(String(value).replace(",", "."));
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
  }, [value]);

  const [cents, setCents] = useState(initialCents);
  const masked = useMemo(() => centsToMaskedBRL(cents), [cents]);

  useEffect(() => {
    const n = Number(String(value).replace(",", "."));
    const next = Number.isFinite(n) ? Math.round(n * 100) : 0;
    if (next !== cents) setCents(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // validade
  const isValid = useMemo(() => {
    const reais = cents / 100;
    if (reais < (min ?? 0)) return false;
    if (typeof max === "number" && reais > max) return false;
    return reais > 0;
  }, [cents, min, max]);

  useEffect(() => {
    if (typeof onValidChange === "function") onValidChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const handleChange = useCallback((txt) => {
    const nextCents = maskedToCents(txt);
    let bounded = nextCents;
    if (typeof max === "number") bounded = Math.min(bounded, Math.round(max * 100));
    // min não precisa travar digitação; apenas valida
    setCents(bounded);
    if (typeof onChangeRaw === "function") onChangeRaw(bounded / 100);
  }, [onChangeRaw, max]);

  const borderColor = isValid ? (colors.primary || "#7F1D1D") : (colors.error || "#B00020");

  return (
    <View style={[{ width: "100%" }, style]}>
      <TextInput
        value={masked}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.border || "#CBD5E1"}
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={20}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1.2,
          borderColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 16,
          color: "#111827",
        }}
        {...inputProps}
      />
      {showErrorText && !isValid && (
        <Text style={{ marginTop: 6, color: colors.error || "#B00020", fontSize: 12 }}>
          Valor inválido.
        </Text>
      )}
    </View>
  );
}
