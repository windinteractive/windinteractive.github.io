import { html, useState } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';
import { Icon } from './Icon.js';
import { Keypad } from './Keypad.js';

export function Login({ active }) {
  const [pwVisible, setPwVisible] = useState(false);
  const [pw, setPw] = useState('');
  const [keypad, setKeypad] = useState(false);

  // iOS gives web apps no way to supply a keyboard, so the only reliable way to
  // keep the system one away is to have nothing focusable to type into.
  const openKeypad = () => {
    document.activeElement?.blur();
    setKeypad(true);
  };

  return html`
    <div class=${'screen login' + (active ? ' is-active' : '')}>
      <img class="login__logo" src="./img/login_logo.png" alt="" />      

      <div class="login__fields">
        <div class="field">
          <span class="field__icon"><${Icon} name="user" size=${18} /></span>
          <input type="text" placeholder="Username" autocomplete="username"
                 autocapitalize="none" autocorrect="off"
                 onFocus=${() => setKeypad(false)} />
        </div>
        <div class=${'field' + (keypad ? ' is-focused' : '')}>
          <span class="field__icon"><${Icon} name="lock" size=${18} /></span>
          <button type="button" class="field__value" onClick=${openKeypad}>
            ${pw ? (pwVisible ? pw : '•'.repeat(pw.length))
                 : html`<span class="field__placeholder">Password</span>`}
          </button>
          <button type="button" class="field__toggle"
                  aria-label=${pwVisible ? 'Hide password' : 'Show password'}
                  aria-pressed=${pwVisible ? 'true' : 'false'}
                  onClick=${() => setPwVisible(v => !v)}>
            <${Icon} name=${pwVisible ? 'eye-off' : 'eye'} size=${20} />
          </button>
        </div>
      </div>

      <div class="login__actions">
        <button class="btn-primary"
                onClick=${() => { setKeypad(false); go(ROUTES.home); }}>Log In</button>
        <!-- <button class="btn-link" onClick=${() => go(ROUTES.onboarding)}>
          Don't have an account? <b>Sign Up</b>
        </button> -->
      </div>

      <${Keypad} open=${keypad}
                 onKey=${k => setPw(v => v + k)}
                 onBackspace=${() => setPw(v => v.slice(0, -1))}
                 onDone=${() => setKeypad(false)} />
    </div>`;
}
