import { requireAuth } from "../auth/guard.js";
import {
  createVehicle,
  getVehicleById,
  updateVehicle,
} from "../api/vehicles.api.js";
import { renderNavbar } from "../components/navbar.js";
import { getQueryParams } from "../utils/queryParams.js";
import {
  getErrorMessage,
  setButtonLoading,
  setFeedback,
  setLoadingState,
} from "../utils/ui.js";
import { validateVehicleForm } from "../utils/validators.js";

const root = document.querySelector("#vehicle-form-root");
const { id = "" } = getQueryParams();
const isEditMode = Boolean(id);

const renderForm = (vehicle = {}) => `
  <section class="glass-panel p-6">
    <p class="section-eyebrow">Tu anuncio</p>
    <h1 class="section-title">${isEditMode ? "Editar auto" : "Publicar auto"}</h1>
    <p class="section-copy">
      ${isEditMode ? "Actualiza la informacion de tu anuncio." : "Completa los datos principales para publicar tu auto."}
    </p>
  </section>

  <div id="vehicle-form-feedback"></div>

  <section class="glass-panel p-6">
    <form id="vehicle-form" class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="form-label" for="brand">Marca</label>
        <input class="form-input" id="brand" name="brand" type="text" value="${vehicle.brand || ""}" />
      </div>
      <div>
        <label class="form-label" for="model">Modelo</label>
        <input class="form-input" id="model" name="model" type="text" value="${vehicle.model || ""}" />
      </div>
      <div>
        <label class="form-label" for="year">Año</label>
        <input class="form-input" id="year" name="year" type="number" value="${vehicle.year || ""}" />
      </div>
      <div>
        <label class="form-label" for="price">Precio</label>
        <input class="form-input" id="price" name="price" type="number" value="${vehicle.price || ""}" />
      </div>
      <div>
        <label class="form-label" for="mileage">Kilometraje</label>
        <input class="form-input" id="mileage" name="mileage" type="number" value="${vehicle.mileage || ""}" />
      </div>
      <div>
        <label class="form-label" for="location">Ubicacion</label>
        <input class="form-input" id="location" name="location" type="text" value="${vehicle.location || ""}" />
      </div>
      <div>
        <label class="form-label" for="color">Color</label>
        <input class="form-input" id="color" name="color" type="text" value="${vehicle.color || ""}" />
      </div>
      <div>
        <label class="form-label" for="transmission">Transmision</label>
        <select class="form-input" id="transmission" name="transmission">
          <option value="">Seleccionar</option>
          <option value="manual" ${vehicle.transmission === "manual" ? "selected" : ""}>Manual</option>
          <option value="automatic" ${vehicle.transmission === "automatic" ? "selected" : ""}>Automatica</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="form-label" for="fuelType">Combustible</label>
        <select class="form-input" id="fuelType" name="fuelType">
          <option value="">Seleccionar</option>
          <option value="gasoline" ${vehicle.fuelType === "gasoline" ? "selected" : ""}>Gasolina</option>
          <option value="diesel" ${vehicle.fuelType === "diesel" ? "selected" : ""}>Diesel</option>
          <option value="hybrid" ${vehicle.fuelType === "hybrid" ? "selected" : ""}>Hibrido</option>
          <option value="electric" ${vehicle.fuelType === "electric" ? "selected" : ""}>Electrico</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="form-label" for="description">Descripcion</label>
        <textarea class="form-input min-h-36" id="description" name="description">${vehicle.description || ""}</textarea>
      </div>
      <div class="md:col-span-2">
        <label class="form-label" for="images">Enlaces de imagen</label>
        <textarea
          class="form-input min-h-28"
          id="images"
          name="images"
          placeholder="Pega un enlace por linea"
        >${Array.isArray(vehicle.images) ? vehicle.images.join("\n") : ""}</textarea>
      </div>
      <div class="md:col-span-2 flex justify-end gap-3">
        <a class="secondary-button" href="./my-vehicles.html">Cancelar</a>
        <button class="primary-button" type="submit">${isEditMode ? "Guardar cambios" : "Publicar auto"}</button>
      </div>
    </form>
  </section>
`;

if (requireAuth()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const bindForm = () => {
    const form = document.querySelector("#vehicle-form");
    const feedback = document.querySelector("#vehicle-form-feedback");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {
        brand: String(formData.get("brand") || "").trim(),
        model: String(formData.get("model") || "").trim(),
        year: Number(formData.get("year")),
        price: Number(formData.get("price")),
        mileage: formData.get("mileage") ? Number(formData.get("mileage")) : 0,
        location: String(formData.get("location") || "").trim(),
        color: String(formData.get("color") || "").trim(),
        transmission: String(formData.get("transmission") || "").trim(),
        fuelType: String(formData.get("fuelType") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        images: String(formData.get("images") || "")
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean),
      };

      const errors = validateVehicleForm(payload);

      if (errors.length > 0) {
        setFeedback(feedback, "error", errors.join(" "));
        return;
      }

      try {
        setButtonLoading(
          submitButton,
          true,
          isEditMode ? "Guardando..." : "Publicando..."
        );

        const response = isEditMode
          ? await updateVehicle(id, payload)
          : await createVehicle(payload);

        setFeedback(
          feedback,
          "success",
          isEditMode ? "Los cambios se guardaron correctamente." : "Tu auto se publico correctamente."
        );
        window.setTimeout(() => {
          window.location.href = "./my-vehicles.html";
        }, 700);
      } catch (error) {
        setFeedback(feedback, "error", getErrorMessage(error));
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  };

  const loadForm = async () => {
    if (!isEditMode) {
      root.innerHTML = renderForm();
      bindForm();
      return;
    }

    setLoadingState(root, "Cargando informacion...");

    try {
      const response = await getVehicleById(id);
      root.innerHTML = renderForm(response.data.vehicle);
      bindForm();
    } catch (error) {
      root.innerHTML = `
        <section class="glass-panel p-6">
          <p class="section-eyebrow">Error</p>
          <h1 class="section-title">No pudimos abrir este anuncio</h1>
          <p class="section-copy">${getErrorMessage(error)}</p>
          <a class="primary-button mt-6" href="./my-vehicles.html">Volver</a>
        </section>
      `;
    }
  };

  loadForm();
}
