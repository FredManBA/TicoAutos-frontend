import { formatCurrency, formatStatusLabel } from "../utils/ui.js";

const getVehicleImage = (vehicle) =>
  Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images[0]
    : "";

export const renderVehicleCard = (vehicle, { includeActions = false } = {}) => `
  <article class="glass-panel overflow-hidden">
    ${
      getVehicleImage(vehicle)
        ? `<img class="h-48 w-full object-cover" src="${getVehicleImage(vehicle)}" alt="${vehicle.brand} ${vehicle.model}" />`
        : `<div class="h-48 bg-gradient-to-br from-stone-800 via-stone-900 to-orange-950"></div>`
    }
    <div class="space-y-4 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">${vehicle.brand}</p>
          <h3 class="font-display text-3xl uppercase">${vehicle.model}</h3>
          <p class="mt-1 text-sm text-stone-400">${vehicle.year} | ${vehicle.location || "Costa Rica"}</p>
        </div>
        <span class="status-pill ${vehicle.status}">${formatStatusLabel(vehicle.status)}</span>
      </div>
      <p class="text-sm text-stone-300">${vehicle.description}</p>
      <div class="flex items-center justify-between gap-4">
        <strong class="text-xl text-sand">${formatCurrency(vehicle.price)}</strong>
        <a class="secondary-button" href="./vehicle-detail.html?id=${vehicle._id}">Ver auto</a>
      </div>
      ${
        includeActions
          ? `
            <div class="flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <a class="secondary-button" href="./vehicle-form.html?id=${vehicle._id}">Editar</a>
              <button class="secondary-button vehicle-sold-button" type="button" data-id="${vehicle._id}">
                Marcar como vendido
              </button>
              <button class="secondary-button vehicle-delete-button" type="button" data-id="${vehicle._id}">
                Eliminar
              </button>
              <a class="secondary-button" href="./received-questions.html?vehicleId=${vehicle._id}">
                Ver mensajes
              </a>
            </div>
          `
          : ""
      }
    </div>
  </article>
`;
