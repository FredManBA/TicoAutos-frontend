import { renderNavbar } from "../components/navbar.js";
import { requireAuth } from "../auth/guard.js";
import { getStoredUser } from "../utils/storage.js";

if (requireAuth()) {
  renderNavbar(document.querySelector("#navbar-root"));

  const user = getStoredUser();

  document.querySelector("#dashboard-root").innerHTML = `
    <section class="glass-panel p-6">
      <p class="section-eyebrow">Tu cuenta</p>
      <h1 class="section-title">${user?.name ? `Hola, ${user.name}` : "Bienvenido"}</h1>
      <p class="section-copy">
        Desde aqui puedes administrar tus anuncios y revisar tus mensajes.
      </p>
    </section>
    <section class="dashboard-grid">
      <article class="dashboard-card">
        <h3>Mis autos</h3>
        <p class="mt-4 text-stone-300">Publica, edita o retira tus anuncios cuando quieras.</p>
        <a class="primary-button mt-6" href="./my-vehicles.html">Ver mis autos</a>
      </article>
      <article class="dashboard-card">
        <h3>Consultas enviadas</h3>
        <p class="mt-4 text-stone-300">Revisa las preguntas que has hecho y sus respuestas.</p>
        <a class="primary-button mt-6" href="./my-questions.html">Ver consultas</a>
      </article>
      <article class="dashboard-card">
        <h3>Mensajes recibidos</h3>
        <p class="mt-4 text-stone-300">Responde a las personas interesadas en tus autos.</p>
        <a class="primary-button mt-6" href="./received-questions.html">Ver mensajes</a>
      </article>
    </section>
  `;
}
