import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "portfolio_token";

export async function saveToken(token: string, remember = false) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // Fallback to AsyncStorage if SecureStore fails
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
}

export async function removeToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}