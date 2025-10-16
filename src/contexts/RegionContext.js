import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@regiao";
const DEFAULT = "centro";

export const RegionContext = createContext({ regiao: DEFAULT, setRegiao: () => {} });

export function RegionProvider({ children }) {
  const [regiao, setRegiaoState] = useState(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setRegiaoState(String(saved).toLowerCase());
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setRegiao = useCallback(async (nova) => {
    const value = String(nova || DEFAULT).toLowerCase();
    setRegiaoState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  }, []);

  const value = useMemo(() => ({ regiao, setRegiao }), [regiao, setRegiao]);

  if (!ready) return null;

  return React.createElement(
    RegionContext.Provider,
    { value },
    children
  );
}

export function useRegiao() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegiao deve ser usado dentro de <RegionProvider>");
  return ctx;
}
