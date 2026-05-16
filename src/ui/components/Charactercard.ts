import type { Character } from '../../classes/Character.ts';
import { HpBar } from './HpBar.ts';

export class CharacterCard {
  private character: Character;
  private hpBar: HpBar;
  private el: HTMLDivElement;
  private statusEl: HTMLDivElement;
  private nameEl: HTMLSpanElement;
  private effectEl : HTMLDivElement;

  constructor(character: Character) {
    this.character = character;
    this.hpBar = new HpBar();
    this.el = document.createElement('div');
    this.nameEl = document.createElement('span');
    this.effectEl = document.createElement('div');
    this.statusEl = document.createElement('div');
    this.buildCard();
  }

  private buildCard(): void {
    const c = this.character;
    const isRed = c.teamColor === 'Red';
    const accentColor = isRed ? '#c0392b' : '#2980b9';
    const glowColor   = isRed ? '#e74c3c' : '#3498db';

    this.el.style.cssText = `
      background: #181824; border: 1px solid #2a2a3d;
      border-left: 3px solid ${accentColor};
      border-radius: 6px; padding: 10px 12px;
      display: flex; flex-direction: column; gap: 6px;
      transition: all 0.2s ease; position: relative;
    `;

    // Header row
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: baseline;';

    this.nameEl.textContent = c.name;
    this.nameEl.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 0.8rem;
      color: ${glowColor}; letter-spacing: 0.05em;
    `;

    const roleEl = document.createElement('span');
    roleEl.textContent = c.role;
    roleEl.style.cssText = `
      font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
      color: #44445a; text-transform: uppercase; letter-spacing: 0.1em;
    `;

    header.appendChild(this.nameEl);
    header.appendChild(roleEl);

    // Stats row
    // const stats = document.createElement('div');
    this.statusEl.style.cssText = `
      display: flex; gap: 10px;
      font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #8888aa;
    `;
    this.statusEl.innerHTML = `
      <span title="Attack">⚔ ${c.atk}</span>
      <span title="Defense">🛡 ${c.def}</span>
      <span title="Speed">⚡ ${c.speed}</span>
    `;

    // Status effects
    this.effectEl.style.cssText = 'display: flex; flex-wrap: wrap; gap: 3px; min-height: 16px;';

    this.el.appendChild(header);
    this.el.appendChild(this.hpBar.render());
    this.el.appendChild(this.statusEl);
    this.el.appendChild(this.effectEl);
  }

  render(): HTMLElement {
    return this.el;
  }

  update(): void {
    const c = this.character;
    this.hpBar.update(c.hp, c.maxHp);
    this.statusEl.innerHTML = `
      <span title="Attack">⚔ ${c.atk}</span>
      <span title="Defense">🛡 ${c.def}</span>
      <span title="Speed">⚡ ${c.speed}</span>
    `;

    // Dead state
    if (!c.isAlive) {
      this.el.style.opacity = '0.35';
      this.el.style.filter = 'grayscale(1)';
      this.nameEl.style.textDecoration = 'line-through';
    } else {
      this.el.style.opacity = '1';
      this.el.style.filter = 'none';
    }

    // Status badges - Buffs and Debuffs
    this.effectEl.innerHTML = '';
    [...c.buffs, ...c.debuffs].forEach(effect => {
      const badge = document.createElement('span');
      badge.textContent = effect.name;
      const isBuff = effect.type === 'Buff';
      badge.style.cssText = `
        font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
        padding: 1px 5px; border-radius: 2px;
        background: ${isBuff ? '#1a3a1a' : '#3a1a1a'};
        color: ${isBuff ? '#27ae60' : '#e74c3c'};
        border: 1px solid ${isBuff ? '#27ae60' : '#e74c3c'};
      `;
      this.effectEl.appendChild(badge);
    });

    // Passive abilities - shown in separate section
    if (c.passives.length > 0) {
      const passiveSeparator = document.createElement('div');
      passiveSeparator.style.cssText = 'width: 100%; height: 1px; background: #3d3d5c; margin: 2px 0;';
      this.effectEl.appendChild(passiveSeparator);

      c.passives.forEach(passive => {
        const badge = document.createElement('span');
        badge.textContent = passive.name;
        badge.style.cssText = `
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          padding: 1px 5px; border-radius: 2px;
          background: #1a2a3a;
          color: #3498db;
          border: 1px solid #3498db;
        `;
        this.effectEl.appendChild(badge);
      });
    }
  }

  highlight(active: boolean): void {
    if (active) {
      this.el.style.boxShadow = `0 0 16px ${this.character.teamColor === 'Red' ? '#e74c3c' : '#3498db'}`;
    } else if (!this.el.classList.contains('targetable')) {
      // Only clear if not in targetable state
      this.el.style.boxShadow = 'none';
    }
  }

  /** Expose root element for external click listeners */
  getElement(): HTMLElement {
    return this.el;
  }

  /**
   * Marks this card as a selectable target during player targeting phase.
   * Adds a distinct teal/green glow + pointer cursor and a pulsing border.
   */
  setTargetable(on: boolean): void {
    if (on) {
      this.el.classList.add('targetable');
      this.el.style.cursor = 'pointer';
      this.el.style.boxShadow = '0 0 20px #00d4aa, 0 0 4px #00d4aa inset';
      this.el.style.borderColor = '#00d4aa';
      this.el.style.outline = '1px solid rgba(0,212,170,0.4)';
      this.el.style.animation = 'target-pulse 1s ease-in-out infinite';
    } else {
      this.el.classList.remove('targetable');
      this.el.style.cursor = '';
      this.el.style.boxShadow = 'none';
      // Restore the left border accent colour
      const isRed = this.character.teamColor === 'Red';
      this.el.style.borderColor = isRed ? '#c0392b' : '#2980b9';
      this.el.style.outline = '';
      this.el.style.animation = '';
    }
  }
}