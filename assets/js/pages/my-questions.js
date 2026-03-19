import { requireAuth } from "../auth/guard.js";
import { getMyQuestions } from "../api/questions.api.js";
import { renderNavbar } from "../components/navbar.js";
import {
  formatDate,
  formatStatusLabel,
  getErrorMessage,
  renderEmptyState,
  setLoadingState,
} from "../utils/ui.js";

const root = document.querySelector("#my-questions-root");

const renderQuestionCard = (item) => `
  <article class="glass-panel p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          ${item.vehicle.brand} ${item.vehicle.model}
        </p>
        <h3 class="font-display text-2xl uppercase">Consulta enviada</h3>
      </div>
      <span class="status-pill ${item.status}">${formatStatusLabel(item.status)}</span>
    </div>
    <p class="mt-4 text-sm text-stone-300">${item.message}</p>
    <p class="mt-2 text-xs uppercase tracking-[0.15em] text-stone-500">
      ${formatDate(item.askedAt)}
    </p>
    ${
      item.answer
        ? `
          <div class="mt-4 rounded-2xl bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-amber-300">Respuesta</p>
            <p class="mt-3 text-sm text-stone-200">${item.answer.message}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.15em] text-stone-500">
              ${formatDate(item.answer.answeredAt)}
            </p>
          </div>
        `
        : `
          <div class="mt-4 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-stone-400">
            Todavia no hay respuesta.
          </div>
        `
    }
  </article>
`;

if (requireAuth()) {
  renderNavbar(document.querySelector("#navbar-root"));
  setLoadingState(root, "Cargando tus consultas...");

  getMyQuestions()
    .then((response) => {
      const items = response.data.items;

      root.innerHTML = `
        <section class="glass-panel p-6">
          <p class="section-eyebrow">Tus mensajes</p>
          <h1 class="section-title">Consultas enviadas</h1>
          <p class="section-copy">
            Aqui puedes ver las consultas que has hecho y sus respuestas.
          </p>
        </section>
        ${
          items.length
            ? `<section class="space-y-4">${items.map(renderQuestionCard).join("")}</section>`
            : renderEmptyState({
                title: "Todavia no has enviado consultas",
                description: "Cuando preguntes por un auto, la conversacion aparecera aqui.",
                actionLabel: "Ver autos",
                actionHref: "./index.html",
              })
        }
      `;
    })
    .catch((error) => {
      root.innerHTML = renderEmptyState({
        title: "No pudimos cargar tus consultas",
        description: getErrorMessage(error),
      });
    });
}
