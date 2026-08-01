import { html } from '../vendor/preact-standalone.mjs';
import { go, ROUTES } from '../router.js';
import { Icon } from './Icon.js';
import { Nav } from './Nav.js';

// Mock data. Set img to a file under ./img/ to use a picture instead of the
// initial; leave it '' and the initial is drawn.
const AVATARS = [
  { name: '婁戴民 TM',    initial: 'TM', img: './users/user_tm.webp' },
  // { name: '溫志暉 Jason', initial: 'J',  img: './users/user_jason.webp' },
  // { name: '霍立德',       initial: '霍', img: './users/user_tei.webp' },
  // { name: '郭志能',       initial: '郭', img: './users/user_lan.webp' },
  // { name: '俞藝涵',       initial: '俞', img: './users/user_hun.webp' },
];

// glyph is a small mark drawn on the gradient disc; img fills the whole circle.
const ROWS = [
  { id: 'group',  initial: '',   img: '', glyph: './img/chat_group_icon_1.webp', isGroup: true,
    name: 'Group',          msg: 'Received a voice message', time: 'now' },
  { id: 'tm',     initial: 'TM', img: './users/user_tm.webp',
    name: '婁戴民 (TM)',    msg: '好啊，咁就照呢個方法做',      time: '30+ days ago' },
  // { id: 'fok',    initial: '霍', img: './users/user_tei.webp',
  //   name: '霍立德',         msg: '收到，份文件我睇咗喇',        time: '30+ days' },
  // { id: 'jason',  initial: 'J',  img: './users/user_jason.webp',
  //   name: '溫志暉 (Jason)', msg: '得，遲啲再傾',               time: '30+ days' },
  // { 
  //   id: 'kwok',  
  //   initial: '郭',  
  //   img: './users/user_lan.webp',
  //   name: '郭志能', 
  //   msg: '冇問題，我跟進下先',               
  //   time: '30+ days' 
  // },
  // { 
  //   id: 'yu',  
  //   initial: '俞',  
  //   img: './users/user_ng.webp',
  //   name: '吳忻憐', 
  //   msg: '好啦，有咩再搵我',               
  //   time: '30+ days' 
  // },
];

export function Contacts({ active }) {
  return html`
    <div class=${'screen contacts' + (active ? ' is-active' : '')}>
      <header class="app-header">
        <img src="./icons/logo.webp" alt="" width="50" height="50" />
        <h2>Contact</h2>
        <img src="./icons/logo.webp" alt="" width="50" height="50" style="opacity:0" />
      </header>

      <div class="searchbar-row">
        <div class="searchbar">          
          
          <${Icon} name="search" size=${16} />
          Search...
        
        </div>
      </div>

      <div class="stories">
        ${AVATARS.map(c => html`
          <div class="story" key=${c.name}>
            <div class="story__av">
              ${c.img ? html`<img class="story__img" src=${c.img} alt="" />` : c.initial}
              <span class="story__dot"></span>
            </div>
            <div class="story__name">${c.name}</div>
          </div>
        `)}
      </div>

      <div class="scroll">
        ${ROWS.map(row => html`
          <button class="contact-row" key=${row.id} onClick=${() => go(ROUTES.chat)}>
            <span class=${'avatar' + (row.isGroup ? ' avatar--group' : '')}>
              ${row.img   ? html`<img class="avatar__img" src=${row.img} alt="" />`
              : row.glyph ? html`<img src=${row.glyph} alt="" width="26" height="26" />`
              : row.initial}
            </span>
            <span class="contact-row__main">
              <span class="contact-row__name">${row.name}</span>
              <span class="contact-row__msg">${row.msg}</span>
            </span>
            <span class="contact-row__time">${row.time}</span>
          </button>
        `)}
      </div>

      <${Nav} active="chats" />
    </div>`;
}
