import { formatDate } from "../utils/ui.js";

export const renderMessageList = (items = []) => `
  <div class="space-y-4">
    ${items
      .map(
        (item) => `
          <article class="glass-panel p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  ${item.vehicleLabel}
                </p>
                <h3 class="font-display text-2xl uppercase">${item.title}</h3>
              </div>
              <span class="status-pill ${item.status}">${item.status}</span>
            </div>
            <p class="mt-4 text-sm text-stone-300">${item.question}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.15em] text-stone-500">
              ${formatDate(item.date)}
            </p>
            ${
              item.answer
                ? `<div class="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-stone-200">${item.answer}</div>`
                : `<div class="mt-4 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-stone-400">Sin respuesta por ahora.</div>`
            }
          </article>
        `
      )
      .join("")}
  </div>
`;
