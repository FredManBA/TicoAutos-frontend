import { renderNavbar } from "../components/navbar.js";
import { createQuestion } from "../api/questions.api.js";
import { getVehicleById } from "../api/vehicles.api.js";
import { getQueryParams } from "../utils/queryParams.js";
import { isAuthenticated } from "../utils/storage.js";
import {
  copyToClipboard,
  formatCurrency,
  formatFuelTypeLabel,
  formatStatusLabel,
  formatTransmissionLabel,
  getErrorMessage,
  renderEmptyState,
  setButtonLoading,
  setFeedback,
  setLoadingState,
} from "../utils/ui.js";
import { validateQuestionMessage } from "../utils/validators.js";

renderNavbar(document.querySelector("#navbar-root"));

const { id = "" } = getQueryParams();
const container = document.querySelector("#vehicle-detail-root");

const renderQuestionPanel = (vehicleId) => `
  <section class="glass-panel p-6">
    <p class="section-eyebrow">Escribe al vendedor</p>
    <h2 class="mt-3 font-display text-3xl uppercase">Haz una consulta</h2>
    ${
      isAuthenticated()
        ? `
          <form id="question-form" class="mt-5 space-y-4">
            <textarea
              id="question-message"
              name="message"
              class="form-input min-h-32"
              placeholder="Escribe tu mensaje"
            ></textarea>
            <button class="primary-button w-full" type="submit">Enviar pregunta</button>
          </form>
          <div id="question-feedback" class="mt-4"></div>
        `
        : `
          <p class="mt-4 text-sm text-stone-300">
            Inicia sesion para escribirle al vendedor.
          </p>
          <a class="primary-button mt-5 w-full" href="./login.html">Entrar</a>
        `
    }
    <input type="hidden" value="${vehicleId}" />
  </section>
`;

const renderVehicleDetail = (vehicle) => {
  const images = Array.isArray(vehicle.images) && vehicle.images.length
    ? vehicle.images
    : [""];

  container.innerHTML = `
    <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="glass-panel overflow-hidden">
        ${
          images[0]
            ? `<img class="h-80 w-full object-cover" src="${images[0]}" alt="${vehicle.brand} ${vehicle.model}" />`
            : `<div class="h-80 bg-gradient-to-br from-stone-800 via-stone-900 to-orange-950"></div>`
        }
        <div class="space-y-5 p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="section-eyebrow">Auto seleccionado</p>
              <h1 class="section-title">${vehicle.brand} ${vehicle.model}</h1>
            </div>
            <span class="status-pill ${vehicle.status}">${formatStatusLabel(vehicle.status)}</span>
          </div>
          <p class="text-lg text-sand">${formatCurrency(vehicle.price)}</p>
          <p class="text-stone-300">${vehicle.description}</p>
          <div class="grid gap-3 rounded-3xl bg-white/5 p-5 md:grid-cols-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Año</p>
              <p class="mt-2 text-xl font-bold">${vehicle.year}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Kilometraje</p>
              <p class="mt-2 text-xl font-bold">${vehicle.mileage || 0} km</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Ubicacion</p>
              <p class="mt-2 text-xl font-bold">${vehicle.location || "Costa Rica"}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Transmision</p>
              <p class="mt-2 text-xl font-bold">${vehicle.transmission ? formatTransmissionLabel(vehicle.transmission) : "No indicada"}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Combustible</p>
              <p class="mt-2 text-xl font-bold">${vehicle.fuelType ? formatFuelTypeLabel(vehicle.fuelType) : "No indicado"}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Color</p>
              <p class="mt-2 text-xl font-bold">${vehicle.color || "No indicado"}</p>
            </div>
          </div>
        </div>
      </div>

      <aside class="flex flex-col gap-6">
        <section class="glass-panel p-6">
          <p class="section-eyebrow">Vendedor</p>
          <h2 class="mt-3 font-display text-3xl uppercase">Informacion de contacto</h2>
          <div class="mt-5 space-y-2 text-sm text-stone-300">
            <p><strong class="text-white">Codigo:</strong> ${vehicle.owner?._id || "N/D"}</p>
            <p><strong class="text-white">Nombre:</strong> ${vehicle.owner?.name || "N/D"}</p>
          </div>
        </section>

        <section class="glass-panel p-6">
          <p class="section-eyebrow">Compartir</p>
          <h2 class="mt-3 font-display text-3xl uppercase">Comparte este anuncio</h2>
          <p class="mt-4 text-sm text-stone-300">
            Copia el enlace y compartelo por donde quieras.
          </p>
          <button id="copy-link-button" class="primary-button mt-5 w-full" type="button">
            Copiar enlace
          </button>
          <div id="copy-feedback" class="mt-4"></div>
        </section>

        ${renderQuestionPanel(vehicle._id)}
      </aside>
    </section>
  `;

  document.querySelector("#copy-link-button")?.addEventListener("click", async () => {
    const feedback = document.querySelector("#copy-feedback");

    try {
      await copyToClipboard(window.location.href);
      setFeedback(feedback, "success", "Enlace copiado.");
    } catch (error) {
      setFeedback(feedback, "error", "No pudimos copiar el enlace.");
    }
  });

  const questionForm = document.querySelector("#question-form");

  questionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = String(
      new FormData(questionForm).get("message") || ""
    ).trim();
    const errors = validateQuestionMessage(message);
    const feedback = document.querySelector("#question-feedback");
    const submitButton = questionForm.querySelector('button[type="submit"]');

    if (errors.length > 0) {
      setFeedback(feedback, "error", errors.join(" "));
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Enviando...");
      await createQuestion({
        vehicleId: vehicle._id,
        message,
      });
      questionForm.reset();
      setFeedback(feedback, "success", "Tu consulta fue enviada.");
    } catch (error) {
      setFeedback(feedback, "error", getErrorMessage(error));
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
};

const loadDetail = async () => {
  if (!id) {
    container.innerHTML = renderEmptyState({
      title: "Anuncio no disponible",
      description: "Este enlace esta incompleto o ya no es valido.",
      actionLabel: "Ver autos",
      actionHref: "./index.html",
    });
    return;
  }

  setLoadingState(container, "Cargando informacion...");

  try {
    const response = await getVehicleById(id);
    renderVehicleDetail(response.data.vehicle);
  } catch (error) {
    container.innerHTML = renderEmptyState({
      title: "No pudimos cargar este auto",
      description: getErrorMessage(error),
      actionLabel: "Ver autos",
      actionHref: "./index.html",
    });
  }
};

loadDetail();
