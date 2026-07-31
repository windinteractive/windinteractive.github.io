import { html } from '../vendor/preact-standalone.mjs';

// The prototype referenced 22 files under assets/icons/ that were never present in
// the repo. They are drawn here instead: one 24x24 grid, currentColor throughout,
// so a single stylesheet rule can tint and dim them.
//
// Each entry is a function rather than a cached vnode: Preact mutates vnodes while
// diffing, and every screen stays mounted at once, so the same icon can be on
// screen in two places simultaneously (the tab bar exists on Home and Contacts).

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const PATHS = {
  search: () => html`<circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />`,
  user: () => html`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />`,
  lock: () => html`<rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />`,
  eye: () => html`<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />`,
  'eye-off': () => html`<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />`,
  bell: () => html`<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />`,
  plus: () => html`<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />`,
  'plus-circle': () => html`<circle cx="12" cy="12" r="9" /><line stroke='#fff' x1="12" y1="8.5" x2="12" y2="15.5" /><line stroke='#fff' x1="8.5" y1="12" x2="15.5" y2="12" />`,
  back: () => html`<line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />`,
  backspace: () => html`<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z" /><line x1="12" y1="9.5" x2="17" y2="14.5" /><line x1="17" y1="9.5" x2="12" y2="14.5" />`,
  'double-check': () => html`<polyline points="1 12.5 5.5 17 13 7" /><polyline points="7.5 12.5 12 17 19.5 7" />`,
  mic: () => html`<rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />`,
  'mic-circle': () => html`<circle cx="12" cy="12" r="11" /> <g stroke='#fff'  style="transform: scale(0.69); transform-origin: center center"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></g>`,

  'nav-home': () => html`<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />`,
  'nav-edit': () => html`<path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />`,
  'nav-chat': () => html`<path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 0 1 4 11.5 8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />`,

  'stat-cpu': () => html`<rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />`,
  'stat-memory': () => html`<rect x="2" y="7" width="20" height="11" rx="2" /><path d="M6 18v3M12 18v3M18 18v3M7 11v3M12 11v3M17 11v3" />`,
  'stat-battery': () => html`<rect x="2" y="7" width="16" height="10" rx="2" /><line x1="21" y1="10.5" x2="21" y2="13.5" /><rect x="4.5" y="9.5" width="7" height="5" fill="currentColor" stroke="none" />`,
  'stat-network': () => html`<path d="M4.5 12.2a11 11 0 0 1 15 0" /><path d="M8 15.6a6.2 6.2 0 0 1 8 0" /><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />`,
};

// The prototype reused one drawing for both the header and the tab bar.
PATHS['nav-bell'] = PATHS.bell;
PATHS['nav-user'] = PATHS.user;

// Solid marks read better than strokes at these sizes.
const SOLID = {
  more: () => html`<circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" />`,
};

// Deterministic bar heights, so the two voice notes look distinct but stable.
const WAVE = {
  waveform: [9, 21, 6, 17, 24, 11, 8, 19, 14, 26, 5, 15, 22, 9, 18, 7, 25, 12, 16, 6, 20, 10, 23, 8, 14, 17, 21, 7, 13, 25, 9, 18, 6, 16, 23, 11, 19, 8, 15, 24, 10, 20, 5, 17, 26, 12, 7, 22, 14, 9, 19, 6].splice(9),
  'waveform-2': [18, 6, 24, 11, 9, 20, 15, 26, 7, 13, 22, 9, 17, 5, 19, 24, 8, 14, 10, 21, 6, 16, 25, 11, 8, 19, 12, 23, 7, 17, 9, 20, 6, 15, 25, 10, 18, 5, 21, 8, 14, 26, 11, 19, 7, 16, 24, 9, 13, 22, 6, 17].splice(12),
};

export function Icon({ name, size = 24, className }) {
  const bars = WAVE[name];  // only the first 50 bars fit in the 180px width
  if (bars) {
    const w_v = 180;
    const gap = w_v / bars.length;
    const h_v = 39;
    return html`
      <svg class=${className} width="${w_v}" height="${h_v}" viewBox="0 0 ${w_v} ${h_v}"
           fill="currentColor" aria-hidden="true">
        ${bars.map((h, i) => html`
          <rect key=${i} x=${(i * gap).toFixed(2)} y=${((h_v - h) / 2).toFixed(2)}
                width=${(gap * 0.42).toFixed(2)} height=${h} rx=${(gap * 0.175).toFixed(2)} />
        `)}
      </svg>`;
  }

  if (SOLID[name]) {
    return html`
      <svg class=${className} width=${size} height=${size} viewBox="0 0 24 24"
           fill="currentColor" aria-hidden="true">${SOLID[name]()}</svg>`;
  }

  const body = PATHS[name];
  if (!body) throw new Error(`Icon: unknown name "${name}"`);
  return html`
    <svg class=${className} width=${size} height=${size} viewBox="0 0 24 24"
         ...${STROKE} aria-hidden="true">${body()}</svg>`;
}
