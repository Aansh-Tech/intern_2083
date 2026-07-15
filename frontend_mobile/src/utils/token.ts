import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "portfolio_token";

let memoryToken: string | null = null;

export async function saveToken(token: string, persist = true) {
  memoryToken = token;
  if (persist) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function getToken() {
  if (memoryToken) return memoryToken;
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  memoryToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}