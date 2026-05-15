type LogType = 'damage' | 'death' | 'skill' | 'counter' | 'block' | 'system' | 'victory' | 'default';

function classifyLog(message: string): LogType {
  if (message.includes('💀') || message.includes('fallen')) return 'death';
  if (message.includes('💥') || message.includes('COUNTER') || message.includes('⚡')) return 'counter';
  if (message.includes('uses skill') || message.includes('Call Reinforcement') ||
      message.includes('joined') || message.includes('Block')) return 'skill';
  if (message.includes('block') || message.includes('Blocking')) return 'block';
  if (message.includes('Victory') || message.includes('Lost')) return 'victory';
  if (message.includes('Game') || message.includes('Turn') || message.includes('---')) return 'system';
  if (message.includes('takes') || message.includes('damage')) return 'damage';
  return 'default';
}

export class BattleLog {
  private el: HTMLDivElement;
  private scroll: HTMLDivElement;
  private maxEntries: number;

  constructor(maxEntries: number = 200) {
    this.maxEntries = maxEntries;
    this.el = document.createElement('div');
    this.el.className = 'log-panel';

    const title = document.createElement('h2');
    title.textContent = 'Combat Log';
    this.el.appendChild(title);

    this.scroll = document.createElement('div');
    this.scroll.className = 'log-scroll';
    this.el.appendChild(this.scroll);
  }

  render(): HTMLElement {
    return this.el;
  }

  add(message: string): void {
    const type = classifyLog(message);
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    this.scroll.appendChild(entry);

    // Trim old entries to keep DOM lean
    while (this.scroll.children.length > this.maxEntries) {
      this.scroll.removeChild(this.scroll.firstChild!);
    }

    this.scroll.scrollTop = this.scroll.scrollHeight;
  }

  addSeparator(label: string): void {
    const sep = document.createElement('div');
    sep.className = 'log-entry system';
    sep.style.cssText = 'border-top: 1px solid #2a2a3d; padding-top: 6px; margin-top: 4px; color: #555570;';
    sep.textContent = `── ${label} ──`;
    this.scroll.appendChild(sep);
    this.scroll.scrollTop = this.scroll.scrollHeight;
  }

  clear(): void {
    this.scroll.innerHTML = '';
  }
}