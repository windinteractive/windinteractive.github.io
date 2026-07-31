import { html, useEffect } from '../vendor/preact-standalone.mjs';
import { replace, ROUTES } from '../router.js';

// Not a real wait — the app has nothing to fetch here. This stands in for one.
const LOADING_MS = 6000;

export function Loading({ active }) {
  useEffect(() => {
    if (!active) return undefined;
    const t = setTimeout(() => replace(ROUTES.home), LOADING_MS);
    return () => clearTimeout(t);
  }, [active]);

  return html`
    <div class=${'screen loading' + (active ? ' is-active' : '')}>
      <img class="loading__logo" src="./icons/logo.webp" alt="" />
    </div>`;
}
