import React, { useMemo, useCallback, useState } from "react";
import { TextInput, View, Text } from "react-native";

/** --- Utils --- */
const onlyDigits = (s = "") => String(s).replace(/\D/g, "").slice(0, 11);

function formatCpf(raw = "") {
  const d = onlyDigits(raw);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

function isRepeatedSequence(digits) {
  if (digits.length !== 11) return false;
  return /^(\d)\1{10}$/.test(digits); // 00000000000, 11111111111, ...
}

function validateCpf(raw = "") {
  const digits = onlyDigits(raw);
  if (digits.length !== 11) return false;
  if (isRepeatedSequence(digits)) return false;

  // Dígito 1
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== Number(digits[9])) return false;

  // Dígito 2
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  if (d2 !== Number(digits[10])) return false;

  return true;
}

/**
 * CPFInputBR
 * Props:
 *  - value (string): valor controlado (pode vir formatado ou só dígitos)
 *  - onChangeRaw (fn): callback com o valor cru (apenas dígitos)
 *  - onValidChange (fn): callback boolean quando valid/invalid muda
 *  - colors (obj opcional): { primary, border, error }
 *  - placeholder (string)
 *  - style (obj): estilo extra pro container do input
 *  - inputProps (obj): props extras pro TextInput
 *  - disabled (bool)
 */
export default function CPFInputBR({
  value,
  onChangeRaw,
  onValidChange,
  colors = {},
  placeholder = "000.000.000-00",
  style,
  inputProps = {},
  disabled = false,
}) {
  const [touched, setTouched] = useState(false);

  const raw = useMemo(() => onlyDigits(value || ""), [value]);
  const masked = useMemo(() => formatCpf(raw), [raw]);
  const isValid = useMemo(() => validateCpf(raw), [raw]);

  // Notifica validade (apenas quando mudar)
  React.useEffect(() => {
    if (typeof onValidChange === "function") onValidChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, raw.length]);

  const handleChange = useCallback(
    (txt) => {
      const d = onlyDigits(txt);
      if (typeof onChangeRaw === "function") onChangeRaw(d);
    },
    [onChangeRaw]
  );

  const showError = touched && raw.length > 0 && !isValid;
  const borderColor = showError
    ? (colors.error || "#B00020")
    : (colors.primary || "#7F1D1D");

  return (
    <View style={[{ width: "100%" }, style]}>
      <TextInput
        value={masked}
        onChangeText={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        placeholderTextColor={colors.border || "#CBD5E1"}
        editable={!disabled}
        keyboardType="number-pad"
        importantForAutofill="no"
        autoComplete="off"
        textContentType="none"
        maxLength={14} // 000.000.000-00
        style={{
          backgroundColor: "#fff",
          borderWidth: 1.2,
          borderColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: "#111827",
        }}
        {...inputProps}
      />
      {showError && (
        <Text style={{ marginTop: 6, color: colors.error || "#B00020", fontSize: 12 }}>
          CPF inválido.
        </Text>
      )}
    </View>
  );
}

// Exporte utils se quiser usar fora
export const cpfUtils = { onlyDigits, formatCpf, validateCpf };
