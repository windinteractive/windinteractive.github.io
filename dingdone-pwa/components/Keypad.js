import { html, useState } from '../vendor/preact-standalone.mjs';
import { Icon } from './Icon.js';

// The 42 keys of icons/password_keys.svg, read left-to-right, top-to-bottom.
const KEYS = [
  'q', '9', 'L', '%', '2', 'z', '#',
  '8', 't', 'Y', '&', 'b', '7', 'D',
  'v', 'G', '3', 'c', 's', '*', 'p',
  'K', 'r', '6', 'j', 'x', 'Q', '0',
  'i', '1', 'g', 'E', '^', 'd', 'n',
  'M', '@', 'h', '!', 'w', '5', 'F',
];

// The artwork has no delete or dismiss key — all 42 are characters — so the bar
// above the grid carries those two.
export function Keypad({ open, onKey, onBackspace, onDone }) {
  // :active alone lights up a key only after a delayed hold on iOS Safari; a
  // touch-driven class makes the press feel instant.
  const [pressed, setPressed] = useState(null);

  return html`
    <div class=${'keypad' + (open ? ' is-open' : '')} aria-hidden=${open ? 'false' : 'true'}>
      <div class="keypad__bar">
        <button type="button" class="keypad__action" aria-label="Delete" onClick=${onBackspace}>
          <${Icon} name="backspace" size=${20} />
        </button>
        <button type="button" class="keypad__action keypad__done" onClick=${onDone}>Done</button>
      </div>
      <div class="keypad__grid">
        ${KEYS.map(k => html`
          <button type="button"
                  class=${'keypad__key' + (pressed === k ? ' is-pressed' : '')}
                  key=${k}
                  onTouchStart=${() => setPressed(k)}
                  onTouchEnd=${() => setPressed(null)}
                  onTouchCancel=${() => setPressed(null)}
                  onClick=${() => onKey(k)}>${k}</button>`)}
      </div>
    </div>`;
}
