import { useMemo } from "react";
import { useRegiao } from "../contexts/RegionContext";
import { getRegionColors } from "./regionColors";

/**
 * Hook de tema por região.
 * Retorna cores derivadas do par [c1, c2] de getRegionColors(regiao).
 */
export function useRegionTheme() {
  const { regiao } = useRegiao();
  const pair = getRegionColors(regiao);
  const c1 = pair[0];
  const c2 = pair[1];

  return useMemo(() => {
    const primary = c1;
    const primaryDark = c2;
    const border = withAlpha(primary, 0.35);
    const soft = withAlpha(primary, 0.10);
    const textOnPrimary = "#FFFFFF";
    return { regiao, colors: { primary, primaryDark, border, soft, textOnPrimary } };
  }, [c1, c2, regiao]);
}

/** Converte #RRGGBB para rgba(r,g,b,a) */
function withAlpha(hex, a = 0.2) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
