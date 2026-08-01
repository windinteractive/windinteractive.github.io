import { html, useState, useRef, useEffect } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';
import { Icon } from './Icon.js';
import { isOpfs, opfsName, fileUrl } from '../opfs.js';

// Mock conversation, overridable from configuration.html. Each entry is one
// message: text draws a bubble, audio draws the fake player for `seconds`,
// video draws a poster tile that opens full screen.
const AVATAR = './users/user_tm.webp';

// The drawings live as files so the artwork can be swapped without touching
// code; `wave` on a message picks one, otherwise they alternate.
const WAVES = ['soundwave-01', 'soundwave-02', 'soundwave-03', 'soundwave-04', 'soundwave-05'];
const waveUrl = name => `./icons/waves/${name}.svg`;

// Used when a video message leaves `src` / `poster` empty.
const VIDEO_SRC = './img/chat.mov';
const VIDEO_POSTER = './img/chat.png';

const DEFAULTS = {
  title: '婁戴民 TM',
  messages: [
    { id: 'v1',  side: 'in',  type: 'audio', seconds: 13, time: '11:27 AM' },
    { id: 'v2',  side: 'out', type: 'audio', seconds: 27, time: '11:27 AM' },
    { id: 'v3',  side: 'in',  type: 'audio', seconds: 8,  time: '11:28 AM' },
    { id: 'v4',  side: 'out', type: 'audio', seconds: 19, time: '11:28 AM' },
    { id: 'v5',  side: 'in',  type: 'audio', seconds: 34, time: '11:29 AM' },
    { id: 'v6',  side: 'out', type: 'audio', seconds: 11, time: '11:30 AM' },
    { id: 'v7',  side: 'in',  type: 'audio', seconds: 22, time: '11:31 AM' },
    { id: 'v8',  side: 'out', type: 'audio', seconds: 6,  time: '11:31 AM' },
    { id: 'v9',  side: 'in',  type: 'audio', seconds: 41, time: '11:32 AM' },
    { id: 'v10', side: 'out', type: 'audio', seconds: 16, time: '11:33 AM' },
    { id: 'v11', side: 'out',  type: 'video', src: VIDEO_SRC, poster: VIDEO_POSTER, seconds: 8, time: '11:34 AM' },
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
// The five drawings cycle across the audio notes, so neighbours look distinct.
const MESSAGES = CONFIG.messages.map((m, i) => ({
  ...m,
  wave: m.wave
    || WAVES[CONFIG.messages.slice(0, i).filter(x => x.type === 'audio').length % WAVES.length],
}));

const toClock = s =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// One drawing, painted through a CSS mask so the played overlay can tint the
// same shape a second time.
const Wave = ({ wave }) => html`
  <span class="voice__art" style=${`--wave:url('${waveUrl(wave)}')`}></span>`;

const ZOOM = { duration: 260, easing: 'cubic-bezier(.2,.7,.3,1)' };
const SNAP = { duration: 200, easing: 'ease-out' };
// Far enough down or up to mean it, rather than a stray finger.
const DISMISS = 90;
// Under this, the finger never really moved and it counts as a tap.
const TAP = 4;

// The transform that lays the player exactly over the tile it opened from.
// Both rectangles are the untransformed ones, measured before any of this runs.
const overTile = (tile, rest) => {
  const scale = tile.width / rest.width;
  const dx = tile.left + tile.width / 2 - (rest.left + rest.width / 2);
  const dy = tile.top + tile.height / 2 - (rest.top + rest.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
};

export function Chat({ active }) {
  const [input, setInput] = useState('');
  const [sent, setSent] = useState([]);
  const [playing, setPlaying] = useState(null);   // message id, or null
  const [elapsed, setElapsed] = useState(0);
  const [video, setVideo] = useState(null);       // the open video message, or null
  const [files, setFiles] = useState({});         // opfs name -> blob URL
  const scroll = useRef(null);
  const player = useRef(null);
  const backdrop = useRef(null);
  const chrome = useRef(null);      // the buttons, dimmed along with the backdrop
  const tileRect = useRef(null);    // the tile the player grew out of
  const restRect = useRef(null);    // the player untransformed, for the way back
  const drag = useRef(null);        // the dismissing gesture, while one is on
  const closing = useRef(false);

  // Files picked in configuration.html are read out of the origin private file
  // system once, and the blob URLs stand in for their references below.
  useEffect(() => {
    const names = [...new Set(MESSAGES.flatMap(m => [m.src, m.poster]).filter(isOpfs))]
      .map(opfsName);
    if (!names.length) return undefined;

    let live = true;
    const urls = [];
    Promise.all(names.map(n => fileUrl(n).then(url => [n, url], () => null)))
      .then(pairs => {
        const found = pairs.filter(Boolean);
        urls.push(...found.map(([, url]) => url));
        if (live) setFiles(Object.fromEntries(found));
        else urls.forEach(URL.revokeObjectURL);
      });
    return () => { live = false; urls.forEach(URL.revokeObjectURL); };
  }, []);

  // '' rather than the reference itself: an unresolved file must not reach the
  // DOM as a URL the browser would try to fetch.
  const asset = value => (isOpfs(value) ? files[opfsName(value)] || '' : value);

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

  // The backdrop and the buttons dim together, apart from the player itself.
  const fade = (from, to, options) => [backdrop.current, chrome.current]
    .forEach(el => el.animate([{ opacity: from }, { opacity: to }], options));

  const dim = value => [backdrop.current, chrome.current]
    .forEach(el => { el.style.opacity = value; });

  // Starts playing, and grows the player out of the tile that was tapped.
  useEffect(() => {
    if (!video) return undefined;
    const el = player.current;
    if (!el) return undefined;
    restRect.current = el.getBoundingClientRect();
    el.play().catch(() => {});

    // The player is already at its full size: this puts it back over the tile
    // and lets it grow out of it, the way a messenger opens one.
    if (tileRect.current) {
      el.animate(
        [{ transform: overTile(tileRect.current, restRect.current), borderRadius: '14px', opacity: 0 },
         { transform: 'none', borderRadius: '0px', opacity: 1 }],
        ZOOM
      );
      fade(0, 1, ZOOM);
    }

    // Only reached through the button below, and leaving it is done watching.
    const ended = () => closeVideo();
    const changed = () => { if (!document.fullscreenElement) closeVideo(); };
    el.addEventListener('webkitendfullscreen', ended);
    document.addEventListener('fullscreenchange', changed);
    return () => {
      el.removeEventListener('webkitendfullscreen', ended);
      document.removeEventListener('fullscreenchange', changed);
    };
  }, [video]);

  // Leaving the screen stops playback.
  useEffect(() => {
    if (!active) { setPlaying(null); setElapsed(0); setVideo(null); }
  }, [active]);

  const toggle = id => { setElapsed(0); setPlaying(p => (p === id ? null : id)); };

  const openVideo = (m, e) => {
    tileRect.current = e.currentTarget.getBoundingClientRect();
    closing.current = false;
    setVideo(m);
  };

  // Shrinks back into the tile before the overlay goes, from wherever a drag
  // left it. 'forwards' holds the last frame, so nothing flashes at full size.
  const closeVideo = () => {
    if (closing.current) return;
    closing.current = true;
    drag.current = null;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    const el = player.current;
    if (!el || !tileRect.current || !restRect.current) { setVideo(null); return; }
    el.pause();
    const done = () => setVideo(null);
    fade(backdrop.current.style.opacity || 1, 0, { ...ZOOM, fill: 'forwards' });
    el.animate(
      [{ transform: el.style.transform || 'none', borderRadius: '0px', opacity: 1 },
       { transform: overTile(tileRect.current, restRect.current), borderRadius: '14px', opacity: 0 }],
      { ...ZOOM, fill: 'forwards' }
    ).finished.then(done, done);
  };

  const expand = () => {
    const el = player.current;
    if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  const togglePlay = () => {
    const el = player.current;
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };

  // Dragging pulls the player away and dims the backdrop; far enough and it
  // goes. The buttons are left out: capturing the pointer over one would
  // retarget that press's click to here, and it would never fire.
  const dragStart = e => {
    if (closing.current || chrome.current.contains(e.target)) return;
    drag.current = { from: e.clientY, moved: 0, onPlayer: e.target === player.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const dragMove = e => {
    if (!drag.current) return;
    const moved = e.clientY - drag.current.from;
    drag.current.moved = moved;
    const away = Math.min(Math.abs(moved) / 600, 0.25);
    player.current.style.transform = `translateY(${moved}px) scale(${1 - away})`;
    dim(String(1 - Math.min(Math.abs(moved) / 400, 0.75)));
  };

  const dragEnd = () => {
    const gesture = drag.current;
    if (!gesture) return;
    drag.current = null;
    const moved = Math.abs(gesture.moved);
    if (moved > DISMISS) { closeVideo(); return; }

    // Back to rest, whether the drag fell short or never really started.
    const el = player.current;
    el.animate([{ transform: el.style.transform || 'none' }, { transform: 'none' }], SNAP);
    fade(backdrop.current.style.opacity || 1, 1, SNAP);
    el.style.transform = '';
    dim('');

    // A press that went nowhere is a tap: on the player it plays and pauses,
    // and anywhere else it closes. Taps are read here rather than from a click,
    // which the pointer capture above would have retargeted.
    if (moved > TAP) return;
    if (gesture.onPlayer) togglePlay(); else closeVideo();
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setSent(prev => [...prev, { id: Date.now() + '-' + prev.length, text }]);
    setInput('');
    requestAnimationFrame(() => {
      if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
    });
  };

  // The tile takes its size from the poster; the length is drawn over it, since
  // the poster is only the frame.
  const videoTile = m => html`
    <button type="button" class="video-msg" aria-label="Play video message"
            onClick=${e => openVideo(m, e)}>
      <img class="video-msg__poster" src=${asset(m.poster || VIDEO_POSTER)} alt="" />
      ${m.seconds ? html`
        <span class="video-msg__len ticker-number">${toClock(m.seconds)}</span>` : null}
    </button>`;

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
            ${m.type === 'video' && m.side === 'in' ? html`
              <div class="msg-in">
                <div class="msg-in__av"><img class="avatar__img" src=${AVATAR} alt="" /></div>
                ${videoTile(m)}
              </div>`
            : m.type === 'video' ? html`
              <div class="msg-out">${videoTile(m)}</div>`
            : m.type === 'audio' && m.side === 'in' ? html`
              <div class="msg-in">
                <div class="msg-in__av"><img class="avatar__img" src=${AVATAR} alt="" /></div>
                <div class="voice voice--in">
                  <button type="button" class="voice__wave" onClick=${() => toggle(m.id)}
                          aria-label=${playing === m.id ? 'Pause voice message' : 'Play voice message'}>
                    <${Wave} wave=${m.wave} />
                    <span class="voice__played"
                          style=${`width:${playing === m.id ? (elapsed / m.seconds) * 100 : 0}%`}>
                      <${Wave} wave=${m.wave} />
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
                  <${Wave} wave=${m.wave} />
                  <span class="voice__played"
                        style=${`width:${playing === m.id ? (elapsed / m.seconds) * 100 : 0}%`}>
                    <${Wave} wave=${m.wave} />
                  </span>
                </button>
                <div class="voice__len">
                  <span class="ticker-number">
                    ${playing === m.id ? toClock(elapsed) : toClock(m.seconds)}
                  </span>
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

      ${video ? html`
        <div class="video-full"
             onPointerDown=${dragStart} onPointerMove=${dragMove}
             onPointerUp=${dragEnd} onPointerCancel=${dragEnd}>
          <div class="video-full__back" ref=${backdrop}></div>
          <video ref=${player} class="video-full__el" playsinline
                 src=${asset(video.src || VIDEO_SRC)} poster=${asset(video.poster || VIDEO_POSTER)}
                 onEnded=${closeVideo}></video>
          <div class="video-full__chrome" ref=${chrome}>
            <button type="button" class="video-full__btn video-full__close" aria-label="Close video"
                    onClick=${closeVideo}>×</button>
            <button type="button" class="video-full__btn video-full__expand" aria-label="Full screen"
                    onClick=${expand}><${Icon} name="expand" size=${18} /></button>
          </div>
        </div>`
      : null}
    </div>`;
}
