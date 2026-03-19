const TOKEN_KEY = "ticoautos_token";
const USER_KEY = "ticoautos_user";
const API_BASE_URL_KEY = "ticoautos_api_base_url";
const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(getToken());

export const getApiBaseUrl = () =>
  localStorage.getItem(API_BASE_URL_KEY) || DEFAULT_API_BASE_URL;

export const getApiOrigin = () => getApiBaseUrl().replace(/\/api\/?$/, "");

export const setApiBaseUrl = (baseUrl) => {
  if (!baseUrl) {
    localStorage.removeItem(API_BASE_URL_KEY);
    return;
  }

  localStorage.setItem(API_BASE_URL_KEY, baseUrl);
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
