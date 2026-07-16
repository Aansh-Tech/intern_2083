import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "portfolio_token";


export async function saveToken(token: string) {
  console.log("[token] Saving token");

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token
  );

  console.log("[token] Token saved");
}


export async function getToken() {

  const token = await SecureStore.getItemAsync(
    TOKEN_KEY
  );

  console.log(
    "[token] Loaded:",
    token ? token.substring(0,20) : "NULL"
  );

  return token;
}


export async function removeToken(){

  await SecureStore.deleteItemAsync(
    TOKEN_KEY
  );

}