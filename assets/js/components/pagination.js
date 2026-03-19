export const renderPagination = ({ page, totalPages }) => {
  if (!totalPages || totalPages <= 1) {
    return "";
  }

  return `
    <div class="glass-panel flex items-center justify-between gap-4 p-4">
      <button class="secondary-button" type="button" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>
        Pagina anterior
      </button>
      <p class="text-sm text-stone-300">Pagina ${page} de ${totalPages}</p>
      <button class="secondary-button" type="button" data-page="${page + 1}" ${page >= totalPages ? "disabled" : ""}>
        Pagina siguiente
      </button>
    </div>
  `;
};
