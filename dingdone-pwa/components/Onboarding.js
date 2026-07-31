import { html } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';

export function Onboarding({ active }) {
  return html`
    <div class=${'screen onboarding' + (active ? ' is-active' : '')}>
      <div class="onboarding__body">
        <h1>Your Private<br />Group, Always<br />Connected</h1>
        <p>
          Chat, share updates, and stay in sync with your trusted circle. dingDONG
          keeps your private community close, simple, and secure.
        </p>
        <button class="btn-primary" onClick=${() => go(ROUTES.login)}>Get Start</button>
      </div>
    </div>`;
}
