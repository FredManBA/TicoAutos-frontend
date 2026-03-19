import { renderNavbar } from "../components/navbar.js";
import { registerUser } from "../api/auth.api.js";
import { requireGuest } from "./guard.js";
import { saveSession } from "../utils/storage.js";
import {
  clearFeedback,
  getErrorMessage,
  setButtonLoading,
  setFeedback,
} from "../utils/ui.js";
import { validateRegisterForm } from "../utils/validators.js";

if (requireGuest()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const form = document.querySelector("#register-form");
  const feedback = document.querySelector("#auth-feedback");
  const submitButton = form?.querySelector('button[type="submit"]');

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFeedback(feedback);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      password: String(formData.get("password") || ""),
      phone: String(formData.get("phone") || "").trim(),
    };

    const errors = validateRegisterForm(payload);

    if (errors.length > 0) {
      setFeedback(feedback, "error", errors.join(" "));
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Creando cuenta...");
      const response = await registerUser(payload);

      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      setFeedback(feedback, "success", "Tu cuenta ya esta lista.");
      window.setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 500);
    } catch (error) {
      setFeedback(feedback, "error", getErrorMessage(error));
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
}
