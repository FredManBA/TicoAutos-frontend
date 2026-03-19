import { requireAuth } from "../auth/guard.js";
import {
  deleteVehicle,
  getMyVehicles,
  markVehicleAsSold,
} from "../api/vehicles.api.js";
import { renderNavbar } from "../components/navbar.js";
import { renderVehicleCard } from "../components/vehicle-card.js";
import { getErrorMessage, renderEmptyState, setFeedback, setLoadingState } from "../utils/ui.js";

const root = document.querySelector("#my-vehicles-root");

if (requireAuth()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const renderShell = (content, feedback = "") => `
    <section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="section-eyebrow">Tus autos</p>
        <h1 class="section-title">Tus anuncios</h1>
        <p class="section-copy">
          Administra tus anuncios y revisa los mensajes de cada auto.
        </p>
      </div>
      <a class="primary-button" href="./vehicle-form.html">Publicar auto</a>
    </section>
    <div id="my-vehicles-feedback">${feedback}</div>
    ${content}
  `;

  const loadVehicles = async (flashMessage = "") => {
    setLoadingState(root, "Cargando tus autos...");

    try {
      const response = await getMyVehicles();
      const items = response.data.items;

      const content = items.length
        ? `<section class="grid gap-5 xl:grid-cols-2">
            ${items
              .map((vehicle) => renderVehicleCard(vehicle, { includeActions: true }))
              .join("")}
          </section>`
        : renderEmptyState({
            title: "Todavia no has publicado autos",
            description: "Cuando publiques tu primer anuncio, lo veras aqui.",
            actionLabel: "Publicar auto",
            actionHref: "./vehicle-form.html",
          });

      const feedbackMarkup = flashMessage
        ? `<div class="feedback-box success">${flashMessage}</div>`
        : "";

      root.innerHTML = renderShell(content, feedbackMarkup);
    } catch (error) {
      root.innerHTML = renderShell(
        renderEmptyState({
          title: "No pudimos cargar tus autos",
          description: getErrorMessage(error),
        }),
        `<div class="feedback-box error">${getErrorMessage(error)}</div>`
      );
    }
  };

  root.addEventListener("click", async (event) => {
    const soldButton = event.target.closest(".vehicle-sold-button");
    const deleteButton = event.target.closest(".vehicle-delete-button");

    if (soldButton) {
      try {
        soldButton.disabled = true;
        const response = await markVehicleAsSold(soldButton.dataset.id);
        await loadVehicles(response.message);
      } catch (error) {
        setFeedback(
          root.querySelector("#my-vehicles-feedback"),
          "error",
          getErrorMessage(error)
        );
      } finally {
        soldButton.disabled = false;
      }
    }

    if (deleteButton) {
      const confirmed = window.confirm("Quieres eliminar este auto?");

      if (!confirmed) {
        return;
      }

      try {
        deleteButton.disabled = true;
        const response = await deleteVehicle(deleteButton.dataset.id);
        await loadVehicles(response.message);
      } catch (error) {
        setFeedback(
          root.querySelector("#my-vehicles-feedback"),
          "error",
          getErrorMessage(error)
        );
      } finally {
        deleteButton.disabled = false;
      }
    }
  });

  loadVehicles();
}
