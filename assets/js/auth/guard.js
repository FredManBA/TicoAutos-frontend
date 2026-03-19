import { isAuthenticated } from "../utils/storage.js";

export const requireAuth = (redirectTo = "./login.html") => {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }

  return true;
};

export const requireGuest = (redirectTo = "./dashboard.html") => {
  if (isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }

  return true;
};
