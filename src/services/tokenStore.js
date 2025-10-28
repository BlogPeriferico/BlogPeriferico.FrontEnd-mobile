// src/services/tokenStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "@auth/token";
export const USERID_KEY = "@auth/userId";

export async function saveToken(token) {
  try {
    if (!token) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
}

export async function getToken() {
  try {
    return (await AsyncStorage.getItem(TOKEN_KEY)) || null;
  } catch {
    return null;
  }
}

export async function saveUserId(id) {
  try {
    if (id != null) await AsyncStorage.setItem(USERID_KEY, String(id));
  } catch {}
}

export async function getUserId() {
  try {
    return (await AsyncStorage.getItem(USERID_KEY)) || null;
  } catch {
    return null;
  }
}

export async function clearAuth() {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USERID_KEY]);
  } catch {}
}
