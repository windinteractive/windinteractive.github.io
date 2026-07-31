import { html } from '../vendor/preact-standalone.mjs';
import { Icon } from './Icon.js';

// One definition for the tab bar the prototype had copy-pasted on both Home
// (lines 106-112) and Contacts (lines 145-151).
const TABS = [
  { id: 'home', icon: 'nav-home', label: 'Home', route: '#/home' },
  { id: 'tasks', icon: 'nav-edit', label: 'Tasks' },
  { id: 'chats', icon: 'nav-chat', label: 'Chats', route: '#/contacts' },
  { id: 'alerts', icon: 'nav-bell', label: 'Alerts' },
  { id: 'profile', icon: 'nav-user', label: 'Profile' },
];

export function Nav({ active }) {
  return html`
    <nav class="bottom-nav" style="background: none; border:none;">
      <!--
      ${TABS.map(tab => html`
        <button key=${tab.id}
                class=${'nav-btn' + (tab.id === active ? ' is-active' : '')}
                aria-label=${tab.label}
                aria-current=${tab.id === active ? 'page' : undefined}
                disabled=${!tab.route}
                onClick=${tab.route ? () => { location.hash = tab.route; } : undefined}>
          <${Icon} name=${tab.icon} size=${22} />
        </button>
      `)}
      -->
      <img 
        style="width: 100%" 
        src=${active=='home' ? "./img/home_btns.png" : "./img/contact_nav_bar.webp"}
        onClick=${()=> location.hash = (active=='home'? '#/contacts' : '#/home')}
      />
    </nav>`;
}
