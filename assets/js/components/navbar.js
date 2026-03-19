import { clearSession, getStoredUser, isAuthenticated } from "../utils/storage.js";

const guestLinks = `
  <a class="secondary-button" href="./login.html">Entrar</a>
  <a class="primary-button" href="./register.html">Crear cuenta</a>
`;

const userLinks = (userName) => `
  <a class="secondary-button" href="./dashboard.html">Mi cuenta</a>
  <a class="secondary-button" href="./my-vehicles.html">Mis autos</a>
  <a class="secondary-button" href="./my-questions.html">Mensajes</a>
  <button class="primary-button" id="logout-button" type="button">
    Salir ${userName ? `| ${userName}` : ""}
  </button>
`;

const isCurrentPage = (pageName) => window.location.pathname.endsWith(pageName);

const navTextClass = (pageName) =>
  isCurrentPage(pageName)
    ? "text-amber-300"
    : "text-stone-300 hover:text-white";

export const renderNavbar = (container) => {
  if (!container) {
    return;
  }

  const user = getStoredUser();

  container.innerHTML = `
    <header class="sticky top-0 z-30 border-b border-white/10 bg-stone-950/75 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <a class="flex items-center gap-3" href="./index.html">
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-700 font-display text-xl text-stone-950">
            TA
          </span>
          <div>
            <p class="font-display text-2xl uppercase tracking-[0.2em] text-sand">TicoAutos</p>
            <p class="text-xs uppercase tracking-[0.25em] text-stone-400">Compra y vende autos</p>
          </div>
        </a>
        <nav class="flex flex-wrap items-center gap-3">
          <a class="text-sm font-semibold ${navTextClass("index.html")}" href="./index.html">Autos</a>
          ${isAuthenticated() ? userLinks(user?.name || "") : guestLinks}
        </nav>
      </div>
    </header>
  `;

  const logoutButton = container.querySelector("#logout-button");

  logoutButton?.addEventListener("click", () => {
    clearSession();
    window.location.href = "./login.html";
  });
};
