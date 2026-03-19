import { renderNavbar } from "../components/navbar.js";
import { renderPagination } from "../components/pagination.js";
import { renderVehicleCard } from "../components/vehicle-card.js";
import { listVehicles } from "../api/vehicles.api.js";
import { getQueryParams, updateUrlQuery } from "../utils/queryParams.js";
import {
  getErrorMessage,
  renderEmptyState,
  setFeedback,
  setLoadingState,
} from "../utils/ui.js";
import { validateVehicleFilters } from "../utils/validators.js";

renderNavbar(document.querySelector("#navbar-root"));

const form = document.querySelector("#vehicle-filters-form");
const vehicleList = document.querySelector("#vehicle-list");
const paginationRoot = document.querySelector("#pagination-root");
const summary = document.querySelector("#catalog-summary");
const feedback = document.querySelector("#home-feedback");

const applyFiltersToForm = (filters) => {
  Object.entries(filters).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });
};

const getFiltersFromForm = () => {
  const formData = new FormData(form);
  return {
    brand: String(formData.get("brand") || "").trim(),
    model: String(formData.get("model") || "").trim(),
    yearMin: String(formData.get("yearMin") || "").trim(),
    yearMax: String(formData.get("yearMax") || "").trim(),
    priceMin: String(formData.get("priceMin") || "").trim(),
    priceMax: String(formData.get("priceMax") || "").trim(),
    status: String(formData.get("status") || "").trim(),
  };
};

const renderCatalog = (items, pagination) => {
  if (!items.length) {
    vehicleList.innerHTML = renderEmptyState({
      title: "No encontramos autos",
      description: "Prueba con otros filtros para ver mas opciones.",
    });
    paginationRoot.innerHTML = "";
    return;
  }

  vehicleList.innerHTML = items.map((vehicle) => renderVehicleCard(vehicle)).join("");
  paginationRoot.innerHTML = renderPagination(pagination);
};

const loadVehicles = async (queryParams = {}) => {
  setLoadingState(vehicleList, "Buscando autos...");
  paginationRoot.innerHTML = "";
  setFeedback(feedback, "info", "Estamos buscando opciones para ti.");

  try {
    const response = await listVehicles(queryParams);
    const { items, pagination } = response.data;
    summary.textContent = `${pagination.totalItems} autos encontrados | pagina ${pagination.page}`;
    renderCatalog(items, pagination);
    setFeedback(feedback, "success", "Resultados actualizados.");
  } catch (error) {
    summary.textContent = "No pudimos cargar los autos";
    vehicleList.innerHTML = renderEmptyState({
      title: "No pudimos mostrar los autos",
      description: getErrorMessage(error),
    });
    paginationRoot.innerHTML = "";
    setFeedback(feedback, "error", getErrorMessage(error));
  }
};

const initialFilters = { ...getQueryParams() };
if (!initialFilters.page) {
  initialFilters.page = "1";
}
if (!initialFilters.limit) {
  initialFilters.limit = "6";
}

applyFiltersToForm(initialFilters);
loadVehicles(initialFilters);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const filters = {
    ...getFiltersFromForm(),
    page: "1",
    limit: "6",
  };

  const errors = validateVehicleFilters(filters);

  if (errors.length > 0) {
    setFeedback(feedback, "error", errors.join(" "));
    return;
  }

  updateUrlQuery(filters);
  loadVehicles(filters);
});

paginationRoot.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");

  if (!button || button.disabled) {
    return;
  }

  const filters = {
    ...getFiltersFromForm(),
    page: button.dataset.page,
    limit: "6",
  };

  updateUrlQuery(filters);
  loadVehicles(filters);
});
