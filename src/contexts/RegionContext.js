import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@regiao";
export const RegionContext = createContext({ regiao: "centro", setRegiao: () => {} });

export function RegionProvider({ children }) {
  const [regiao, setRegiaoState] = useState("centro");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setRegiaoState(saved);
      } catch (_) {}
      setReady(true);
    })();
  }, []);

  const setRegiao = async (nova) => {
    const value = String(nova || "centro").toLowerCase();
    setRegiaoState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  };

  if (!ready) return null;

  return (
    <RegionContext.Provider value={{ regiao, setRegiao }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegiao() {
  return useContext(RegionContext);
}
