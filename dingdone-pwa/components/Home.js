import { html } from '../vendor/preact-standalone.mjs';
import { Icon } from './Icon.js';
import { Nav } from './Nav.js';

// Mock data, carried over verbatim from the prototype.
const STATS = [
  { icon: 'stat-cpu', label: 'CPU', value: '58%' },
  { icon: 'stat-memory', label: 'Memory', value: '62%' },
  { icon: 'stat-battery', label: 'Battery', value: '81%' },
  { icon: 'stat-network', label: 'Network', value: '73%' },
];

const TASKS = [
  { name: 'Gait_Init', desc: 'Initialize walking parameters', mode: 'Manual' },
  { name: 'Balance_Test', desc: 'Balance stability test', mode: 'Manual' },
];

export function Home({ active }) {
  return html`
    <div class=${'screen home' + (active ? ' is-active' : '')}>
      <header class="app-header">
        
        <img src="./icons/logo.webp" alt="" width="50" height="50" />
        <h2>Home</h2>
        <span class="icon-btn">
          <!-- <${Icon} name="bell" size=${26} /> -->
          <img src="./img/home_icon.webp" height="24" />
        </span>
        
        <!-- <img src="./svg/p004_div001_menu.svg" />  -->
        
      </header>

      <div class="searchbar-row">
        <!-- 
        <div class="searchbar">
          <${Icon} name="search" size=${16} />
          Search programs, robots, or tasks...
        </div>
        <div class="searchbar-new">
          <${Icon} name="plus" size=${16} />NEW
        </div>
        -->
        <img src="./svg/p004_div002_searchbar.svg" style="width:100%" />
      </div>

      <div class="scroll">
        <section class="card2" style="margin-bottom: 16px;">
          <img src="./svg/p004_div003_robot.svg" />
        </section>

        <section class="card2" style="margin-bottom: 16px;">
          <!--
          <h3 class="status-head">System Status <span>All Nominal ✓</span></h3>
          <div class="stat-grid">
            ${STATS.map(s => html`
              <div class="stat" key=${s.label}>
                <div class="stat__ring"><${Icon} name=${s.icon} size=${20} /></div>
                <div class="stat__label">${s.label}</div>
                <div class="stat__value">${s.value}</div>
              </div>
            `)}
          </div>
          -->
          <img src="./svg/p004_div004_sysstaus.svg" />
          
        </section>
        
        <!--
        ${TASKS.map(t => html`
          <div class="task-row" key=${t.name}>
            <div>
              <div class="task-row__name">${t.name}</div>
              <div class="task-row__desc">${t.desc}</div>
            </div>
            <div class="task-row__mode">${t.mode}</div>
          </div>
        `)}
        -->
        <section class="card2" style="margin-bottom: 16px;">
          <img src="./svg/p004_div004_task.svg"  style="width: 100%" />
        </section>

      </div>

      <${Nav} active="home" />
    </div>`;
}
