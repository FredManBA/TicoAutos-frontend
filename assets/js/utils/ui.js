export const setFeedback = (container, type, message) => {
  if (!container) {
    return;
  }

  if (!message) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `<div class="feedback-box ${type}">${message}</div>`;
};

export const clearFeedback = (container) => {
  if (container) {
    container.innerHTML = "";
  }
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

export const formatStatusLabel = (status) => {
  const labels = {
    available: "Disponible",
    sold: "Vendido",
    pending: "Pendiente",
    answered: "Respondida",
  };

  return labels[status] || status;
};

export const formatTransmissionLabel = (value) => {
  const labels = {
    manual: "Manual",
    automatic: "Automática",
  };

  return labels[value] || value;
};

export const formatFuelTypeLabel = (value) => {
  const labels = {
    gasoline: "Gasolina",
    diesel: "Diésel",
    hybrid: "Híbrido",
    electric: "Eléctrico",
  };

  return labels[value] || value;
};

export const getErrorMessage = (error, fallback = "Ocurrio un error inesperado.") => {
  if (error?.payload?.errors?.length) {
    return error.payload.errors.map((item) => item.message).join(" ");
  }

  if (error?.payload?.message) {
    return error.payload.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export const setButtonLoading = (button, isLoading, loadingText = "Procesando...") => {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = loadingText;
    return;
  }

  button.disabled = false;
  button.textContent = button.dataset.originalText || button.textContent;
};

export const renderEmptyState = ({
  title,
  description,
  actionLabel = "",
  actionHref = "#",
}) => `
  <section class="placeholder-card">
    <h2 class="font-display text-3xl uppercase">${title}</h2>
    <p class="mt-3 text-stone-300">${description}</p>
    ${
      actionLabel
        ? `<a class="primary-button mt-5" href="${actionHref}">${actionLabel}</a>`
        : ""
    }
  </section>
`;

export const setLoadingState = (container, message = "Cargando...") => {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <section class="glass-panel p-6">
      <p class="section-eyebrow">Cargando</p>
      <h2 class="section-title">${message}</h2>
    </section>
  `;
};
