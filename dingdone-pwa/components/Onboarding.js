import { html } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';

// configuration.html overrides this via localStorage, the way Splash does.
function loadSkipLogin() {
  try { return localStorage.getItem('onboarding:skipLogin') === '1'; }
  catch (e) { return false; }
}

const SKIP_LOGIN = loadSkipLogin();

export function Onboarding({ active }) {
  return html`
    <div class=${'screen onboarding' + (active ? ' is-active' : '')}>
      <div class="onboarding__body">
        <h1>Your Private<br />Group, Always<br />Connected</h1>
        <p>
          Chat, share updates, and stay in sync with your trusted circle. dingDONG
          keeps your private community close, simple, and secure.
        </p>
        <button class="btn-primary"
                onClick=${() => go(SKIP_LOGIN ? ROUTES.home : ROUTES.login)}>Get Start</button>
      </div>
    </div>`;
}
