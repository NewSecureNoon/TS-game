import './styles/base.css';
import './styles/simulation.css';
import './styles/player.css';
// import { SimulationUI } from './ui/SimulationUI.ts';
import { PlayerUI } from './ui/PlayerUI.ts';

const app = document.getElementById('app')!;

function showLanding(): void {
  app.innerHTML = '';

  const landing = document.createElement('div');
  landing.style.cssText = `
    height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 48px;
    background: radial-gradient(ellipse at 50% 60%, #1a0a0a 0%, #0a0a0f 60%);
    overflow-y: auto;
  `;

  const titleWrap = document.createElement('div');
  titleWrap.style.textAlign = 'center';
  const title = document.createElement('h1');
  title.textContent = 'BATTLE ENGINE';
  title.style.cssText = `
    font-family: var(--font-display); font-size: 3.5rem; letter-spacing: 0.3em;
    color: var(--text-primary); text-shadow: 0 0 60px rgba(200,60,40,0.4);
    margin-bottom: 8px;
  `;
  const sub = document.createElement('p');
  sub.textContent = 'Turn-Based Combat System';
  sub.style.cssText = `
    font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.2em;
    color: var(--text-muted); text-transform: uppercase;
  `;
  titleWrap.appendChild(title);
  titleWrap.appendChild(sub);

  const divider = document.createElement('div');
  divider.style.cssText = `
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, transparent, #3d3d5c, transparent);
  `;

  const modeRow = document.createElement('div');
  modeRow.style.cssText = 'display: flex; gap: 32px; align-items: stretch;';
  // modeRow.appendChild(createModeCard(
  //   'Simulation',
  //   'Run 100 automated battles and watch win-rate analytics update live.',
  //   ['Adjustable speed', 'Live HP tracking', 'Win rate chart'],
  //   '#f39c12', '#7a4d09',
  //   () => loadSimulation()
  // ));
  modeRow.appendChild(createModeCard(
    'Play vs Bot',
    'Control the Red party yourself. Choose attacks and skills each turn.',
    ['Player choices', 'Enemy AI', 'Victory screen'],
    '#e74c3c', '#5c1a14',
    () => loadPlayer()
  ));

  landing.appendChild(titleWrap);
  landing.appendChild(divider);
  landing.appendChild(modeRow);
  app.appendChild(landing);
}

function createModeCard(
  title: string, desc: string, features: string[],
  accent: string, accentDim: string, onClick: () => void
): HTMLElement {
  const card = document.createElement('div');
  card.style.cssText = `
    background: #11111a; border: 1px solid #2a2a3d; border-top: 3px solid ${accent};
    border-radius: 10px; padding: 32px; width: 280px;
    display: flex; flex-direction: column; gap: 16px;
    cursor: pointer; transition: all 0.25s ease;
  `;
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = `0 12px 40px ${accentDim}`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });

  const h2 = document.createElement('h2');
  h2.textContent = title;
  h2.style.cssText = `font-size: 1.1rem; color: ${accent};`;

  const p = document.createElement('p');
  p.textContent = desc;
  p.style.cssText = `font-size: 0.9rem; color: #8888aa; line-height: 1.6;`;

  const list = document.createElement('ul');
  list.style.cssText = 'list-style:none;display:flex;flex-direction:column;gap:6px;margin-top:auto;';
  features.forEach(f => {
    const li = document.createElement('li');
    li.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:#44445a;padding-left:12px;position:relative;`;
    li.innerHTML = `<span style="position:absolute;left:0;color:${accent}">›</span>${f}`;
    list.appendChild(li);
  });

  const btn = document.createElement('button');
  btn.textContent = 'Enter';
  btn.style.cssText = `background:${accentDim};border:1px solid ${accent};color:#fff;margin-top:8px;`;
  btn.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
  card.addEventListener('click', onClick);

  card.appendChild(h2);
  card.appendChild(p);
  card.appendChild(list);
  card.appendChild(btn);
  return card;
}

// function loadSimulation(): void {
//   app.innerHTML = '';
//   const backBtn = makeBackBtn();
//   const container = document.createElement('div');
//   container.style.flex = '1';
//   app.appendChild(backBtn);
//   app.appendChild(container);
//   new SimulationUI(container);
// }

function loadPlayer(): void {
  app.innerHTML = '';
  const backBtn = makeBackBtn();
  const container = document.createElement('div');
  container.style.flex = '1';
  app.appendChild(backBtn);
  app.appendChild(container);
  new PlayerUI(container);
}

function makeBackBtn(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = 'Back';
  btn.style.cssText = 'position:fixed;top:12px;left:12px;z-index:50;font-size:0.65rem;padding:5px 10px;';
  btn.addEventListener('click', showLanding);
  return btn;
}

showLanding();