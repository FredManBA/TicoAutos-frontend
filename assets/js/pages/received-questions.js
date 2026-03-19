import { requireAuth } from "../auth/guard.js";
import { answerQuestion, getReceivedQuestions } from "../api/questions.api.js";
import { getVehicleQuestions } from "../api/vehicles.api.js";
import { renderNavbar } from "../components/navbar.js";
import { getQueryParams } from "../utils/queryParams.js";
import {
  formatDate,
  formatStatusLabel,
  getErrorMessage,
  renderEmptyState,
  setButtonLoading,
  setFeedback,
  setLoadingState,
} from "../utils/ui.js";
import { validateQuestionMessage } from "../utils/validators.js";

const root = document.querySelector("#received-questions-root");
const { vehicleId = "" } = getQueryParams();

const renderAnswerPanel = (item) =>
  item.answer
    ? `
      <div class="mt-4 rounded-2xl bg-white/5 p-4">
        <p class="text-xs uppercase tracking-[0.2em] text-amber-300">Tu respuesta</p>
        <p class="mt-3 text-sm text-stone-200">${item.answer.message}</p>
        <p class="mt-2 text-xs uppercase tracking-[0.15em] text-stone-500">
          ${formatDate(item.answer.answeredAt)}
        </p>
      </div>
    `
    : `
      <form class="answer-form mt-4 space-y-4" data-question-id="${item._id}">
        <textarea
          name="message"
          class="form-input min-h-28"
          placeholder="Escribe tu respuesta"
        ></textarea>
        <button class="primary-button" type="submit">Responder</button>
        <div class="answer-feedback"></div>
      </form>
    `;

const renderQuestionCard = (item) => `
  <article class="glass-panel p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          ${item.vehicle.brand} ${item.vehicle.model}
        </p>
        <h3 class="font-display text-2xl uppercase">Consulta recibida</h3>
      </div>
      <span class="status-pill ${item.status}">${formatStatusLabel(item.status)}</span>
    </div>
    <p class="mt-4 text-sm text-stone-300">${item.message}</p>
    <p class="mt-2 text-xs uppercase tracking-[0.15em] text-stone-500">
      ${item.askedBy?.name || "Alguien"} escribio el ${formatDate(item.askedAt)}
    </p>
    ${renderAnswerPanel(item)}
  </article>
`;

if (requireAuth()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const loadInbox = async (flashMessage = "") => {
    setLoadingState(root, "Cargando mensajes...");

    try {
      const response = vehicleId
        ? await getVehicleQuestions(vehicleId)
        : await getReceivedQuestions();

      const items = response.data.items;
      const vehicleLabel = response.data.vehicle
        ? `${response.data.vehicle.brand} ${response.data.vehicle.model}`
        : "Todos tus autos";

      root.innerHTML = `
        <section class="glass-panel p-6">
          <p class="section-eyebrow">Tus mensajes</p>
          <h1 class="section-title">${vehicleId ? "Mensajes del auto" : "Consultas recibidas"}</h1>
          <p class="section-copy">
            ${vehicleId ? `Mensajes sobre ${vehicleLabel}.` : "Responde a las personas interesadas en tus autos."}
          </p>
          ${flashMessage ? `<div class="feedback-box success mt-5">${flashMessage}</div>` : ""}
        </section>
        ${
          items.length
            ? `<section class="space-y-4">${items.map(renderQuestionCard).join("")}</section>`
            : renderEmptyState({
                title: "Todavia no tienes mensajes",
                description: "Cuando alguien escriba por uno de tus autos, lo veras aqui.",
              })
        }
      `;
    } catch (error) {
      root.innerHTML = renderEmptyState({
        title: "No pudimos cargar tus mensajes",
        description: getErrorMessage(error),
      });
    }
  };

  root.addEventListener("submit", async (event) => {
    const form = event.target.closest(".answer-form");

    if (!form) {
      return;
    }

    event.preventDefault();

    const message = String(new FormData(form).get("message") || "").trim();
    const errors = validateQuestionMessage(message);
    const feedback = form.querySelector(".answer-feedback");
    const submitButton = form.querySelector('button[type="submit"]');

    if (errors.length > 0) {
      setFeedback(feedback, "error", errors.join(" "));
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Enviando...");
      await answerQuestion(form.dataset.questionId, { message });
      await loadInbox("Tu respuesta fue enviada.");
    } catch (error) {
      setFeedback(feedback, "error", getErrorMessage(error));
    } finally {
      setButtonLoading(submitButton, false);
    }
  });

  loadInbox();
}
