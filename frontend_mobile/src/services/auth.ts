import api from "./api";
import { saveToken, removeToken } from "../utils/token";

export async function login(email: string, password: string) {
  const response = await api.post("/login", {
    email,
    password,
  });

  const token = response.data.token;

  await saveToken(token);

  return response.data.user;
}

export async function logout() {
  await api.post("/logout");

  await removeToken();
}

export async function getUser() {
  const response = await api.get("/user");

  return response.data;
}