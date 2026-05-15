import { RedParty, BlueParty, createPartyByName } from '../classes/Party.ts';
import { MadnessBerserker, WarDrummer, PaladinLeader, Knight } from '../classes/Roles.ts';
import { BattleManager } from '../systems/BattleManager.ts';
import { CharacterCard } from './components/Charactercard.ts';
import { BattleLog } from './components/BattleLog.ts';
import { getPartyDescription } from '../systems/HelperFunction.ts';

export class SimulationUI {
  private root: HTMLElement;
  private isRunning = false;
  private playerWins = 0;
  private enemyWins = 0;
  private totalGames = 0;
  private selectedRedParty: string = 'The Couple of Wrath';
  private selectedBlueParty: string = 'The Iron Bison';

  // DOM refs
  private gameCountEl!: HTMLElement;
  private redWinEl!: HTMLElement;
  private blueWinEl!: HTMLElement;
  private redBarEl!: HTMLElement;
  private blueBarEl!: HTMLElement;
  private redPctEl!: HTMLElement;
  private bluePctEl!: HTMLElement;
  private redCardsEl!: HTMLElement;
  private blueCardsEl!: HTMLElement;
  private startBtn!: HTMLButtonElement;
  private stopBtn!: HTMLButtonElement;
  private speedInput!: HTMLInputElement;
  private speedLabel!: HTMLSpanElement;
  private log!: BattleLog;
  private redPartyNameEl!: HTMLElement;
  private bluePartyNameEl!: HTMLElement;

  constructor(container: HTMLElement) {
    this.root = container;
    this.render();
  }

  private render(): void {
    this.root.innerHTML = '';
    this.root.id = 'sim-root';

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'sim-header';

    const title = document.createElement('h1');
    title.textContent = '⚔ Battle Simulation';
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'sim-controls';

    // Party Selection Controls
    const partyControlsWrap = document.createElement('div');
    partyControlsWrap.style.cssText = 'display:flex;gap:20px;align-items:center;flex-wrap:wrap;';

    const redPartyWrap = document.createElement('div');
    redPartyWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const redPartyLabelWrap = document.createElement('div');
    redPartyLabelWrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const redPartyLabel = document.createElement('label');
    redPartyLabel.textContent = 'Team 1 (Red):';
    redPartyLabel.style.cssText = 'font-size:0.8rem;color:#e74c3c;font-weight:bold;';
    const redPartyInfoBtn = document.createElement('button');
    redPartyInfoBtn.textContent = 'ℹ';
    redPartyInfoBtn.style.cssText = 'width:20px;height:20px;border-radius:50%;border:1px solid #e74c3c;background:#3a1a1a;color:#e74c3c;font-size:0.7rem;cursor:pointer;padding:0;';
    redPartyInfoBtn.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.style.cssText = `position:absolute;background:#0a0a0f;border:1px solid #3d3d5c;padding:8px;border-radius:4px;font-size:0.7rem;color:#8888aa;max-width:250px;z-index:1000;white-space:normal;margin-top:5px;`;
      tooltip.innerHTML = getPartyDescription(this.selectedRedParty);
      (e.target as HTMLElement).parentElement?.appendChild(tooltip);
      redPartyInfoBtn.addEventListener('mouseleave', () => tooltip.remove());
    });
    redPartyLabelWrap.appendChild(redPartyLabel);
    redPartyLabelWrap.appendChild(redPartyInfoBtn);
    
    const redPartySelect = document.createElement('select');
    redPartySelect.style.cssText = 'padding:4px 8px;border:1px solid #3d3d5c;background:#181824;color:#8888aa;border-radius:4px;';
    ['The Couple of Wrath', 'The Iron Bison', 'Random'].forEach(party => {
      const option = document.createElement('option');
      option.value = party;
      option.textContent = party;
      if (party === 'The Couple of Wrath') option.selected = true;
      redPartySelect.appendChild(option);
    });
    redPartySelect.addEventListener('change', (e) => {
      this.selectedRedParty = (e.target as HTMLSelectElement).value;
    });
    redPartyWrap.appendChild(redPartyLabelWrap);
    redPartyWrap.appendChild(redPartySelect);

    const bluePartyWrap = document.createElement('div');
    bluePartyWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const bluePartyLabelWrap = document.createElement('div');
    bluePartyLabelWrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const bluePartyLabel = document.createElement('label');
    bluePartyLabel.textContent = 'Team 2 (Blue):';
    bluePartyLabel.style.cssText = 'font-size:0.8rem;color:#3498db;font-weight:bold;';
    const bluePartyInfoBtn = document.createElement('button');
    bluePartyInfoBtn.textContent = 'ℹ';
    bluePartyInfoBtn.style.cssText = 'width:20px;height:20px;border-radius:50%;border:1px solid #3498db;background:#1a2a3a;color:#3498db;font-size:0.7rem;cursor:pointer;padding:0;';
    bluePartyInfoBtn.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.style.cssText = `position:absolute;background:#0a0a0f;border:1px solid #3d3d5c;padding:8px;border-radius:4px;font-size:0.7rem;color:#8888aa;max-width:250px;z-index:1000;white-space:normal;margin-top:5px;`;
      tooltip.innerHTML = getPartyDescription(this.selectedBlueParty);
      (e.target as HTMLElement).parentElement?.appendChild(tooltip);
      bluePartyInfoBtn.addEventListener('mouseleave', () => tooltip.remove());
    });
    bluePartyLabelWrap.appendChild(bluePartyLabel);
    bluePartyLabelWrap.appendChild(bluePartyInfoBtn);
    
    const bluePartySelect = document.createElement('select');
    bluePartySelect.style.cssText = 'padding:4px 8px;border:1px solid #3d3d5c;background:#181824;color:#8888aa;border-radius:4px;';
    ['The Couple of Wrath', 'The Iron Bison', 'Random'].forEach(party => {
      const option = document.createElement('option');
      option.value = party;
      option.textContent = party;
      if (party === 'The Iron Bison') option.selected = true;
      bluePartySelect.appendChild(option);
    });
    bluePartySelect.addEventListener('change', (e) => {
      this.selectedBlueParty = (e.target as HTMLSelectElement).value;
    });
    bluePartyWrap.appendChild(bluePartyLabelWrap);
    bluePartyWrap.appendChild(bluePartySelect);

    partyControlsWrap.appendChild(redPartyWrap);
    partyControlsWrap.appendChild(bluePartyWrap);

    const speedWrap = document.createElement('div');
    speedWrap.className = 'speed-control';
    this.speedInput = document.createElement('input');
    this.speedInput.type = 'range';
    this.speedInput.min = '10';
    this.speedInput.max = '500';
    this.speedInput.value = '50';
    this.speedLabel = document.createElement('span');
    this.speedLabel.textContent = '50ms';
    this.speedInput.addEventListener('input', () => {
      this.speedLabel.textContent = `${this.speedInput.value}ms`;
    });
    speedWrap.appendChild(document.createTextNode('Speed '));
    speedWrap.appendChild(this.speedInput);
    speedWrap.appendChild(this.speedLabel);

    this.startBtn = document.createElement('button');
    this.startBtn.className = 'btn-primary';
    this.startBtn.textContent = 'Start';
    this.startBtn.addEventListener('click', () => this.start());

    this.stopBtn = document.createElement('button');
    this.stopBtn.className = 'btn-danger';
    this.stopBtn.textContent = 'Stop';
    this.stopBtn.disabled = true;
    this.stopBtn.addEventListener('click', () => { this.isRunning = false; });

    controls.appendChild(partyControlsWrap);
    controls.appendChild(speedWrap);
    controls.appendChild(this.startBtn);
    controls.appendChild(this.stopBtn);
    header.appendChild(controls);
    this.root.appendChild(header);

    // ── Body ──
    const body = document.createElement('div');
    body.className = 'sim-body';

    // Win Rate Panel
    const winPanel = document.createElement('div');
    winPanel.className = 'win-rate-panel';

    const winTitle = document.createElement('h2');
    winTitle.textContent = 'Win Rate';
    winPanel.appendChild(winTitle);

    this.gameCountEl = document.createElement('div');
    this.gameCountEl.className = 'game-counter';
    this.gameCountEl.innerHTML = '0<span>/ 100 games</span>';
    winPanel.appendChild(this.gameCountEl);

    const scoreRow = document.createElement('div');
    scoreRow.className = 'score-row';
    scoreRow.innerHTML = `
      <div>
        <div class="score-val red" id="sim-red-wins">0</div>
        <div class="score-label">Red Wins</div>
      </div>
      <div style="color:#44445a;font-family:var(--font-display);font-size:1.5rem;align-self:center">vs</div>
      <div>
        <div class="score-val blue" id="sim-blue-wins">0</div>
        <div class="score-label">Blue Wins</div>
      </div>
    `;
    winPanel.appendChild(scoreRow);

    const barWrap = document.createElement('div');
    barWrap.className = 'win-bar-wrap';

    // Red bar
    const redLabel = document.createElement('div');
    redLabel.className = 'win-bar-label';
    this.redPctEl = document.createElement('span');
    this.redPctEl.style.color = '#e74c3c';
    this.redPctEl.textContent = 'Red  0%';
    redLabel.appendChild(this.redPctEl);

    const redTrack = document.createElement('div');
    redTrack.className = 'win-bar-track';
    this.redBarEl = document.createElement('div');
    this.redBarEl.className = 'win-bar-fill red';
    this.redBarEl.style.width = '0%';
    redTrack.appendChild(this.redBarEl);

    // Blue bar
    const blueLabel = document.createElement('div');
    blueLabel.className = 'win-bar-label';
    this.bluePctEl = document.createElement('span');
    this.bluePctEl.style.color = '#3498db';
    this.bluePctEl.textContent = 'Blue  0%';
    blueLabel.appendChild(this.bluePctEl);

    const blueTrack = document.createElement('div');
    blueTrack.className = 'win-bar-track';
    this.blueBarEl = document.createElement('div');
    this.blueBarEl.className = 'win-bar-fill blue';
    this.blueBarEl.style.width = '0%';
    blueTrack.appendChild(this.blueBarEl);

    barWrap.appendChild(redLabel);
    barWrap.appendChild(redTrack);
    barWrap.appendChild(blueLabel);
    barWrap.appendChild(blueTrack);
    winPanel.appendChild(barWrap);

    // Teams Live Panel
    const teamsPanel = document.createElement('div');
    teamsPanel.className = 'teams-panel';

    const teamsTitle = document.createElement('h2');
    teamsTitle.textContent = 'Live — Current Game';
    teamsPanel.appendChild(teamsTitle);

    const redSection = document.createElement('div');
    redSection.className = 'team-section';
    this.redPartyNameEl = document.createElement('div');
    this.redPartyNameEl.className = 'team-name red';
    this.redPartyNameEl.textContent = this.selectedRedParty;
    this.redCardsEl = document.createElement('div');
    this.redCardsEl.style.display = 'flex';
    this.redCardsEl.style.flexDirection = 'column';
    this.redCardsEl.style.gap = '6px';
    redSection.appendChild(this.redPartyNameEl);
    redSection.appendChild(this.redCardsEl);

    const blueSection = document.createElement('div');
    blueSection.className = 'team-section';
    this.bluePartyNameEl = document.createElement('div');
    this.bluePartyNameEl.className = 'team-name blue';
    this.bluePartyNameEl.textContent = this.selectedBlueParty;
    this.blueCardsEl = document.createElement('div');
    this.blueCardsEl.style.display = 'flex';
    this.blueCardsEl.style.flexDirection = 'column';
    this.blueCardsEl.style.gap = '6px';
    blueSection.appendChild(this.bluePartyNameEl);
    blueSection.appendChild(this.blueCardsEl);

    teamsPanel.appendChild(redSection);
    teamsPanel.appendChild(blueSection);

    // Log
    this.log = new BattleLog(300);

    body.appendChild(winPanel);
    body.appendChild(teamsPanel);
    body.appendChild(this.log.render());
    this.root.appendChild(body);

    this.redWinEl  = document.getElementById('sim-red-wins')!;
    this.blueWinEl = document.getElementById('sim-blue-wins')!;
  }

  private async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.playerWins = 0;
    this.enemyWins = 0;
    this.totalGames = 0;
    this.log.clear();
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;

    // Update team names display
    this.redPartyNameEl.textContent = this.selectedRedParty === 'Random' ? 'The Couple of Wrath (Random)' : this.selectedRedParty;
    this.bluePartyNameEl.textContent = this.selectedBlueParty === 'Random' ? 'The Iron Bison (Random)' : this.selectedBlueParty;

    while (this.totalGames < 100 && this.isRunning) {
      this.totalGames++;
      this.updateCounter();
      this.log.addSeparator(`Game ${this.totalGames}`);

      // Use party factory to create parties based on selections
      const red = createPartyByName(this.selectedRedParty, true);
      const blue = createPartyByName(this.selectedBlueParty, false);

      const manager = new BattleManager(red, blue);
      let cards = this.buildCards(manager);
      let lastTeamMateCount = manager.playerTeam.TeamMate.length + manager.enemyTeam.TeamMate.length;

      while (!manager.isBattleEnds && this.isRunning) {
        const result = manager.nextTurn();
        this.log.add(result);
        cards.forEach(c => c.update());

        // Check if new characters were added (reinforcements) and refresh UI
        const currentTeamMateCount = manager.playerTeam.TeamMate.length + manager.enemyTeam.TeamMate.length;
        if (currentTeamMateCount > lastTeamMateCount) {
          this.refreshTeamUI(manager, cards);
          lastTeamMateCount = currentTeamMateCount;
        }

        await this.sleep();
      }

      if (this.isRunning) {
        if (manager.isPlayerWin) this.playerWins++;
        else this.enemyWins++;
        this.updateScores();
      }
    }

    this.isRunning = false;
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.log.add('🏁 Simulation complete.');
  }

  private buildCards(manager: BattleManager): CharacterCard[] {
    const cards: CharacterCard[] = [];
    this.refreshTeamUI(manager, cards);
    return cards;
  }

  private refreshTeamUI(manager: BattleManager, cards: CharacterCard[]): void {
    this.redCardsEl.innerHTML = '';
    this.blueCardsEl.innerHTML = '';
    cards.length = 0; // Clear the cards array

    manager.playerTeam.TeamMate.forEach(c => {
      const card = new CharacterCard(c);
      card.update();
      this.redCardsEl.appendChild(card.render());
      cards.push(card);
    });

    manager.enemyTeam.TeamMate.forEach(c => {
      const card = new CharacterCard(c);
      card.update();
      this.blueCardsEl.appendChild(card.render());
      cards.push(card);
    });
  }

  private updateCounter(): void {
    this.gameCountEl.innerHTML = `${this.totalGames}<span>/ 100 games</span>`;
  }

  private updateScores(): void {
    const total = this.playerWins + this.enemyWins;
    const redPct  = total > 0 ? Math.round((this.playerWins / total) * 100) : 0;
    const bluePct = total > 0 ? Math.round((this.enemyWins  / total) * 100) : 0;

    this.redWinEl.textContent  = String(this.playerWins);
    this.blueWinEl.textContent = String(this.enemyWins);
    this.redBarEl.style.width  = `${redPct}%`;
    this.blueBarEl.style.width = `${bluePct}%`;
    this.redPctEl.textContent  = `Red  ${redPct}%`;
    this.bluePctEl.textContent = `Blue  ${bluePct}%`;
  }

  private sleep(): Promise<void> {
    return new Promise(r => setTimeout(r, Number(this.speedInput.value)));
  }
}