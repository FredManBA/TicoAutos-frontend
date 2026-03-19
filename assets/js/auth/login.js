import { renderNavbar } from "../components/navbar.js";
import { loginUser } from "../api/auth.api.js";
import { requireGuest } from "./guard.js";
import { saveSession } from "../utils/storage.js";
import {
  clearFeedback,
  getErrorMessage,
  setButtonLoading,
  setFeedback,
} from "../utils/ui.js";
import { validateLoginForm } from "../utils/validators.js";

if (requireGuest()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const form = document.querySelector("#login-form");
  const feedback = document.querySelector("#auth-feedback");
  const submitButton = form?.querySelector('button[type="submit"]');

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFeedback(feedback);

    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    const errors = validateLoginForm(payload);

    if (errors.length > 0) {
      setFeedback(feedback, "error", errors.join(" "));
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Ingresando...");
      const response = await loginUser(payload);

      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      setFeedback(feedback, "success", "Bienvenido de nuevo.");
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
