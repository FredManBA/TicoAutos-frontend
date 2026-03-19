import { requestJson } from "../utils/http.js";

export const registerUser = (payload) =>
  requestJson("/auth/register", {
    method: "POST",
    body: payload,
  });

export const loginUser = (payload) =>
  requestJson("/auth/login", {
    method: "POST",
    body: payload,
  });
