import { html, useEffect } from '../vendor/preact-standalone.mjs';
import { replace, ROUTES } from '../router.js';

const DEFAULT_SPLASH_MS = 1400;

// configuration.html overrides this via localStorage.
function loadSplashMs() {
  try {
    const raw = localStorage.getItem('splash:duration');
    const value = Number(raw);
    return raw !== null && isFinite(value) && value >= 0 ? value : DEFAULT_SPLASH_MS;
  } catch (e) { return DEFAULT_SPLASH_MS; }
}

const SPLASH_MS = loadSplashMs();

export function Splash({ active }) {
  useEffect(() => {
    if (!active) return undefined;
    const t = setTimeout(() => replace(ROUTES.onboarding), SPLASH_MS);
    return () => clearTimeout(t);
  }, [active]);

  return html`
    <div class=${'screen splash' + (active ? ' is-active' : '')}>
      <div>
        <img class="splash__logo" src="./icons/logo.webp" alt="dingDONG" />
        <div class="splash__bar"><i></i></div>
      </div>
    </div>`;
}
