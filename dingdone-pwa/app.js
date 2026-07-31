import { html, render } from './vendor/preact-standalone.mjs';
import { useHashRoute, replace, DEFAULT_ROUTE } from './router.js';
import { Splash } from './components/Splash.js';
import { Onboarding } from './components/Onboarding.js';
import { Login } from './components/Login.js';
import { Loading } from './components/Loading.js';
import { Home } from './components/Home.js';
import { Contacts } from './components/Contacts.js';
import { Chat } from './components/Chat.js';

function App() {
  const route = useHashRoute();
  const screen = route.replace(/^#\//, '').split('/')[0] || 'splash';
  const is = id => screen === id;

  // Every screen stays mounted so the cross-fade in .screen can run, matching the
  // prototype, where all six lived in the DOM at once.
  return html`
    <div class="app">
      <${Splash}     active=${is('splash')} />
      <${Onboarding} active=${is('onboarding')} />
      <${Login}      active=${is('login')} />
      <${Loading}    active=${is('loading')} />
      <${Home}       active=${is('home')} />
      <${Contacts}   active=${is('contacts')} />
      <${Chat}       active=${is('chat')} />
    </div>`;
}

if (!location.hash) replace(DEFAULT_ROUTE);
render(html`<${App} />`, document.getElementById('app'));

// Two fingers touching the top of the screen reaches configuration.html from
// inside this app's own storage container — a Home Screen app can't read
// localStorage written from Safari or a different Home Screen app, so
// configuration.html has to be opened from here.
addEventListener('touchstart', e => {
  if (e.touches.length === 2 && [...e.touches].every(t => t.clientY < 240)) {
    location.href = './configuration.html';
  }
});
