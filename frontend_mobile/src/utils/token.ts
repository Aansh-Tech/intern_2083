import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";


const TOKEN_KEY = "portfolio_token";


export async function saveToken(token: string) {
  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token
  );
}


export async function getToken() {
  const token = await SecureStore.getItemAsync(
    TOKEN_KEY
  );

  return token;
}


export async function removeToken(){

  await SecureStore.deleteItemAsync(
    TOKEN_KEY
  );

}