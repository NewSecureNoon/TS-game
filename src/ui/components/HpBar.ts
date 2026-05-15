export class HpBar {
  private track: HTMLDivElement;
  private fill: HTMLDivElement;
  private label: HTMLSpanElement;

  constructor() {
    this.track = document.createElement('div');
    this.track.style.cssText = `
      height: 8px; background: #0a0a0f; border-radius: 4px;
      overflow: hidden; border: 1px solid #2a2a3d; position: relative;
    `;
    this.fill = document.createElement('div');
    this.fill.style.cssText = `
      height: 100%; width: 100%; border-radius: 4px;
      transition: width 0.4s ease, background-color 0.4s ease;
      background: #27ae60;
    `;
    this.label = document.createElement('span');
    this.label.style.cssText = `
      font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
      color: #8888aa; display: block; text-align: right; margin-top: 2px;
    `;
    this.track.appendChild(this.fill);
  }

  render(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.appendChild(this.track);
    wrap.appendChild(this.label);
    return wrap;
  }

  update(current: number, max: number): void {
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    this.fill.style.width = `${pct}%`;
    this.label.textContent = `${Math.max(0, current)} / ${max}`;

    if (pct > 50) {
      this.fill.style.background = 'linear-gradient(90deg, #1e8449, #27ae60)';
    } else if (pct > 25) {
      this.fill.style.background = 'linear-gradient(90deg, #7a4d09, #f39c12)';
    } else {
      this.fill.style.background = 'linear-gradient(90deg, #5c1a14, #e74c3c)';
    }
  }
}