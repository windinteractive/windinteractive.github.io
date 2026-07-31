import { html, useState, useRef, useEffect } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';
import { Icon } from './Icon.js';

// Mock conversation, overridable from configuration.html. Each entry is one
// message: text draws a bubble, audio draws the fake player for `seconds`.
const DEMO_TEXT = '我是demo我是demo我是demo我是demo我是demo我是demo我是demo';
const AVATAR = './users/user_tm.webp';
const DEFAULTS = {
  title: 'Group',
  messages: [
    { id: 'a', side: 'in',  type: 'text',  text: DEMO_TEXT, time: '11:27 AM' },
    { id: 'b', side: 'out', type: 'audio', seconds: 13, time: '11:27 AM' },
    { id: 'c', side: 'in',  type: 'text',  text: DEMO_TEXT, time: '11:27 AM' },
    { id: 'd', side: 'out', type: 'audio', seconds: 27, time: '11:27 AM' },
  ],
};

// A missing or corrupt entry keeps the defaults rather than blanking the screen.
function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('chat:config'));
    if (saved && saved.messages) return saved;
  } catch (e) { /* fall through to the defaults */ }
  return DEFAULTS;
}

const CONFIG = loadConfig();
// Two drawings, alternating across the audio notes, so neighbours look distinct.
const MESSAGES = CONFIG.messages.map((m, i) => ({
  ...m,
  wave: CONFIG.messages.slice(0, i).filter(x => x.type === 'audio').length % 2
    ? 'waveform-2' : 'waveform',
}));

const toClock = s =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function Chat({ active }) {
  const [input, setInput] = useState('');
  const [sent, setSent] = useState([]);
  const [playing, setPlaying] = useState(null);   // message id, or null
  const [elapsed, setElapsed] = useState(0);
  const scroll = useRef(null);

  // No audio file exists — this walks a wall clock across the waveform so the
  // player behaves like one.
  useEffect(() => {
    if (!playing) return undefined;
    const total = MESSAGES.find(m => m.id === playing).seconds;
    const started = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - started) / 1000;
      if (t >= total) { setPlaying(null); setElapsed(0); } else setElapsed(t);
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  // Leaving the screen stops playback.
  useEffect(() => { if (!active) { setPlaying(null); setElapsed(0); } }, [active]);

  const toggle = id => { setElapsed(0); setPlaying(p => (p === id ? null : id)); };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setSent(prev => [...prev, { id: Date.now() + '-' + prev.length, text }]);
    setInput('');
    requestAnimationFrame(() => {
      if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
    });
  };

  return html`
    <div class=${'screen chat' + (active ? ' is-active' : '')}>
      <header class="chat__head">
        <!--
        <button class="icon-btn" aria-label="Back" onClick=${() => go(ROUTES.contacts)}>
          <${Icon} name="back" size=${28} />
        </button>
        <span>Group</span>
        <button class="icon-btn" aria-label="More">
          <${Icon} name="more" size=${28} />
        </button>
        -->
        
        <img class="chat__head-art"
        src="./img/group_header.webp" style="width: 96%; margin: 0 auto;"
        onClick=${() => go(ROUTES.contacts)} />
        <span class="chat__title">${CONFIG.title}</span>
      </header>

      <div class="chat__scroll" ref=${scroll}>
        ${MESSAGES.map(m => html`
          <div key=${m.id}>
            ${m.type === 'audio' && m.side === 'in' ? html`
              <div class="msg-in">
                <div class="msg-in__av"><img class="avatar__img" src=${AVATAR} alt="" /></div>
                <div class="voice voice--in">
                  <button type="button" class="voice__wave" onClick=${() => toggle(m.id)}
                          aria-label=${playing === m.id ? 'Pause voice message' : 'Play voice message'}>
                    <${Icon} name=${m.wave} />
                    <span class="voice__played"
                          style=${`width:${playing === m.id ? (elapsed / m.seconds) * 100 : 0}%`}>
                      <${Icon} name=${m.wave} />
                    </span>
                  </button>
                  <div class="voice__len">
                    <span class="ticker-number">
                      ${playing === m.id ? toClock(elapsed) : toClock(m.seconds)}
                    </span>
                  </div>
                </div>
              </div>`
            : m.type === 'audio' ? html`
              <div class="voice">
                <button type="button" class="voice__wave" onClick=${() => toggle(m.id)}
                        aria-label=${playing === m.id ? 'Pause voice message' : 'Play voice message'}>
                  <${Icon} name=${m.wave} />
                  <span class="voice__played"
                        style=${`width:${playing === m.id ? (elapsed / m.seconds) * 100 : 0}%`}>
                    <${Icon} name=${m.wave} />
                  </span>
                </button>
                <div class="voice__len">
                  ${playing === m.id ? toClock(elapsed) : toClock(m.seconds)}
                </div>
              </div>`
            : m.side === 'in' ? html`
              <div class="msg-in">
                <div class="msg-in__av"><img class="avatar__img" src=${AVATAR} alt="" /></div>
                <div class="bubble-in">${m.text}</div>
              </div>`
            : html`
              <div class="msg-out"><div class="bubble-out">${m.text}</div></div>`}
            ${m.time ? html`
              <div class=${'msg-time' + (m.side === 'out' ? ' msg-time--out' : '')}>
                ${m.time}${m.side === 'out' ? html`<${Icon} name="double-check" size=${13} className="msg-time__check" />` : null}
              </div>`
            : null}
          </div>
        `)}

        ${sent.map(m => html`
          <div class="msg-out" key=${m.id}>
            <div class="bubble-out">${m.text}</div>
          </div>
        `)}
      </div>

      <div class="composer">
        <button aria-label="Add" onClick=${send}>
          <${Icon} name="plus-circle" size=${54} />
        </button>
        <input type="text" placeholder="Message" value=${input}
               onInput=${e => setInput(e.target.value)}
               onKeyDown=${e => { if (e.key === 'Enter') send(); }} />
        <button aria-label="Voice">
          <${Icon} name="mic-circle" size=${45} />
        </button>
      </div>
    </div>`;
}
