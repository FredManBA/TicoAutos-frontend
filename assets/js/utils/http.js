import { clearSession, getApiBaseUrl, getAuthHeader } from "./storage.js";

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const buildRequestError = (response, payload) => {
  const error = new Error(
    payload?.message || `Request failed with status ${response.status}`
  );

  error.status = response.status;
  error.payload = payload;

  return error;
};

export const requestJson = async (
  path,
  { method = "GET", headers = {}, body, auth = false } = {}
) => {
  const requestHeaders = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(auth ? getAuthHeader() : {}),
    ...headers,
  };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearSession();
    }

    throw buildRequestError(response, payload);
  }

  return payload;
};
