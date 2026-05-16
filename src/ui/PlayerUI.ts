import { createPartyByName } from '../classes/Party.ts';
import { BattleManager } from '../systems/BattleManager.ts';
import type { Character } from '../classes/Character.ts';
import { CharacterCard } from './components/Charactercard.ts';
import { BattleLog } from './components/BattleLog.ts';
import { getPartyDescription } from '../systems/HelperFunction.ts';

export class PlayerUI {
  private root: HTMLElement;
  private manager!: BattleManager;
  private cards: Map<Character, CharacterCard> = new Map();
  private log: BattleLog = new BattleLog(150);
  private selectedPlayerParty: string = 'The Couple of Wrath';
  private selectedBotParty: string = 'The Iron Bison';

  // DOM refs
  private turnIndicatorEl!: HTMLElement;
  private redColEl!: HTMLElement;
  private blueColEl!: HTMLElement;
  private actionButtonsEl!: HTMLElement;
  private newGameBtn!: HTMLButtonElement;

  // Target selection state
  private pendingAction: { type: 'attack' | 'skill'; skillIdx?: number } | null = null;
  private targetCleanups: (() => void)[] = [];

  // Tracks the last battle log message for the end-game cause display
  private lastBattleLog: string = '';

  constructor(container: HTMLElement) {
    this.root = container;
    this.render();
  }

  private render(): void {
    this.root.innerHTML = '';
    this.root.id = 'player-root';

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'player-header';

    const title = document.createElement('h1');
    title.textContent = 'Player vs Bot';
    header.appendChild(title);

    const headerRight = document.createElement('div');
    headerRight.style.cssText = 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;';

    this.turnIndicatorEl = document.createElement('div');
    this.turnIndicatorEl.className = 'turn-indicator';
    this.turnIndicatorEl.textContent = 'Press New Game';

    // Player Party Selection
    const playerPartyWrap = document.createElement('div');
    playerPartyWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;position:relative;';
    const playerPartyLabelWrap = document.createElement('div');
    playerPartyLabelWrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const playerPartyLabel = document.createElement('label');
    playerPartyLabel.textContent = 'Your Party:';
    playerPartyLabel.style.cssText = 'font-size:0.75rem;color:#e74c3c;font-weight:bold;';
    const playerPartyInfoBtn = document.createElement('button');
    playerPartyInfoBtn.textContent = 'ℹ';
    playerPartyInfoBtn.style.cssText = 'width:18px;height:18px;border-radius:50%;border:1px solid #e74c3c;background:#3a1a1a;color:#e74c3c;font-size:0.65rem;cursor:pointer;padding:0;';
    playerPartyInfoBtn.addEventListener('mouseenter', (_) => {
      const tooltip = document.createElement('div');
      tooltip.style.cssText = `position:absolute;background:#0a0a0f;border:1px solid #3d3d5c;padding:8px;border-radius:4px;font-size:0.65rem;color:#8888aa;max-width:220px;z-index:1000;white-space:normal;top:100%;left:0;margin-top:5px;`;
      tooltip.innerHTML = getPartyDescription(this.selectedPlayerParty);
      playerPartyWrap.appendChild(tooltip);
      playerPartyInfoBtn.addEventListener('mouseleave', () => tooltip.remove());
    });
    playerPartyLabelWrap.appendChild(playerPartyLabel);
    playerPartyLabelWrap.appendChild(playerPartyInfoBtn);

    const playerPartySelect = document.createElement('select');
    playerPartySelect.style.cssText = 'padding:4px 8px;border:1px solid #3d3d5c;background:#181824;color:#8888aa;border-radius:4px;font-size:0.75rem;';
    ['The Couple of Wrath', 'The Iron Bison', 'Random'].forEach(party => {
      const option = document.createElement('option');
      option.value = party;
      option.textContent = party;
      if (party === 'The Couple of Wrath') option.selected = true;
      playerPartySelect.appendChild(option);
    });
    playerPartySelect.addEventListener('change', (e) => {
      this.selectedPlayerParty = (e.target as HTMLSelectElement).value;
    });
    playerPartyWrap.appendChild(playerPartyLabelWrap);
    playerPartyWrap.appendChild(playerPartySelect);

    // Bot Party Selection
    const botPartyWrap = document.createElement('div');
    botPartyWrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;position:relative;';
    const botPartyLabelWrap = document.createElement('div');
    botPartyLabelWrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const botPartyLabel = document.createElement('label');
    botPartyLabel.textContent = 'Bot Party:';
    botPartyLabel.style.cssText = 'font-size:0.75rem;color:#3498db;font-weight:bold;';
    const botPartyInfoBtn = document.createElement('button');
    botPartyInfoBtn.textContent = 'ℹ';
    botPartyInfoBtn.style.cssText = 'width:18px;height:18px;border-radius:50%;border:1px solid #3498db;background:#1a2a3a;color:#3498db;font-size:0.65rem;cursor:pointer;padding:0;';
    botPartyInfoBtn.addEventListener('mouseenter', (_) => {
      const tooltip = document.createElement('div');
      tooltip.style.cssText = `position:absolute;background:#0a0a0f;border:1px solid #3d3d5c;padding:8px;border-radius:4px;font-size:0.65rem;color:#8888aa;max-width:220px;z-index:1000;white-space:normal;top:100%;left:0;margin-top:5px;`;
      tooltip.innerHTML = getPartyDescription(this.selectedBotParty);
      botPartyWrap.appendChild(tooltip);
      botPartyInfoBtn.addEventListener('mouseleave', () => tooltip.remove());
    });
    botPartyLabelWrap.appendChild(botPartyLabel);
    botPartyLabelWrap.appendChild(botPartyInfoBtn);

    const botPartySelect = document.createElement('select');
    botPartySelect.style.cssText = 'padding:4px 8px;border:1px solid #3d3d5c;background:#181824;color:#8888aa;border-radius:4px;font-size:0.75rem;';
    ['The Couple of Wrath', 'The Iron Bison', 'Random'].forEach(party => {
      const option = document.createElement('option');
      option.value = party;
      option.textContent = party;
      if (party === 'The Iron Bison') option.selected = true;
      botPartySelect.appendChild(option);
    });
    botPartySelect.addEventListener('change', (e) => {
      this.selectedBotParty = (e.target as HTMLSelectElement).value;
    });
    botPartyWrap.appendChild(botPartyLabelWrap);
    botPartyWrap.appendChild(botPartySelect);

    this.newGameBtn = document.createElement('button');
    this.newGameBtn.textContent = 'New Game';
    this.newGameBtn.className = 'btn-primary';
    this.newGameBtn.addEventListener('click', () => this.newGame());

    headerRight.appendChild(this.turnIndicatorEl);
    headerRight.appendChild(playerPartyWrap);
    headerRight.appendChild(botPartyWrap);
    headerRight.appendChild(this.newGameBtn);
    header.appendChild(headerRight);
    this.root.appendChild(header);

    // ── Battle Field ──
    const field = document.createElement('div');
    field.className = 'battle-field';

    this.redColEl = document.createElement('div');
    this.redColEl.className = 'team-col';

    const vsDivider = document.createElement('div');
    vsDivider.className = 'vs-divider';
    vsDivider.textContent = 'VS';

    this.blueColEl = document.createElement('div');
    this.blueColEl.className = 'team-col';

    field.appendChild(this.redColEl);
    field.appendChild(vsDivider);
    field.appendChild(this.blueColEl);
    this.root.appendChild(field);

    // ── Action Panel ──
    const actionPanel = document.createElement('div');
    actionPanel.className = 'action-panel';

    const leftSide = document.createElement('div');
    leftSide.className = 'action-left';
    const actionLabel = document.createElement('div');
    actionLabel.className = 'action-label';
    actionLabel.textContent = 'Choose Action';
    this.actionButtonsEl = document.createElement('div');
    this.actionButtonsEl.className = 'action-buttons';
    leftSide.appendChild(actionLabel);
    leftSide.appendChild(this.actionButtonsEl);

    // Log panel: fill the right column of the action panel and scroll internally
    const logEl = this.log.render();
    logEl.style.cssText = 'height:100%;min-height:0;background:transparent;border:none;padding:0;display:flex;flex-direction:column;overflow:hidden;';
    const logTitle = logEl.querySelector('h2');
    if (logTitle) {
      logTitle.style.margin = '0';
      logTitle.style.fontSize = '0.8rem';
      logTitle.style.padding = '4px';
      logTitle.style.borderBottom = '1px solid #2a2a3d';
    }
    // Ensure the log scroll container has proper height
    const logScrollDiv = logEl.querySelector('.log-scroll') as HTMLDivElement;
    if (logScrollDiv) {
      logScrollDiv.style.flex = '1';
      logScrollDiv.style.overflowY = 'auto';
      logScrollDiv.style.overflowX = 'hidden';
      logScrollDiv.style.padding = '4px';
    }

    actionPanel.appendChild(leftSide);
    actionPanel.appendChild(logEl);
    this.root.appendChild(actionPanel);
  }

  private newGame(): void {
    // Use party factory to create parties based on selections
    const red = createPartyByName(this.selectedPlayerParty, true);
    const blue = createPartyByName(this.selectedBotParty, false);

    this.manager = new BattleManager(red, blue);
    this.cards.clear();
    this.log.clear();
    document.querySelector('.battle-overlay')?.remove();

    this.buildField();
    this.advance();
  }

  private buildField(): void {
    this.redColEl.innerHTML = '';
    this.blueColEl.innerHTML = '';

    const makeLabel = (text: string, color: 'red' | 'blue') => {
      const el = document.createElement('div');
      const accent = color === 'red' ? '#e74c3c' : '#3498db';
      const dim = color === 'red' ? '#5c1a14' : '#14335c';
      el.style.cssText = `font-family:'Cinzel',serif;font-size:0.7rem;padding:4px 8px;border-radius:4px;background:${dim};color:${accent};border-left:3px solid ${accent};margin-bottom:4px;`;
      el.textContent = text;
      return el;
    };

    this.redColEl.appendChild(makeLabel('YOUR PARTY', 'red'));
    this.blueColEl.appendChild(makeLabel('ENEMY', 'blue'));

    this.manager.playerTeam.TeamMate.forEach(c => {
      const card = new CharacterCard(c);
      card.update();
      this.redColEl.appendChild(card.render());
      this.cards.set(c, card);
    });

    this.manager.enemyTeam.TeamMate.forEach(c => {
      const card = new CharacterCard(c);
      card.update();
      this.blueColEl.appendChild(card.render());
      this.cards.set(c, card);
    });
  }

  private updateAllCards(): void {
    this.cards.forEach(card => card.update());

    // Handle reinforcements added mid-battle
    this.manager.playerTeam.TeamMate.forEach(c => {
      if (!this.cards.has(c)) {
        const card = new CharacterCard(c);
        card.update();
        this.redColEl.appendChild(card.render());
        this.cards.set(c, card);
      }
    });
    this.manager.enemyTeam.TeamMate.forEach(c => {
      if (!this.cards.has(c)) {
        const card = new CharacterCard(c);
        card.update();
        this.blueColEl.appendChild(card.render());
        this.cards.set(c, card);
      }
    });
  }

  private advance(): void {
    if (this.manager.isBattleEnds) { this.endGame(); return; }

    if (this.manager.isNextTurnPlayer()) {
      this.setTurnIndicator('player');
      this.showActionButtons();
    } else {
      this.setTurnIndicator('enemy');
      this.hideActionButtons();
      setTimeout(() => this.runEnemyTurn(), 600);
    }
  }

  private showActionButtons(): void {
    this.actionButtonsEl.innerHTML = '';
    const nextChar = this.manager.peekNextChar();
    if (!nextChar) return;

    // Highlight the acting character card
    this.cards.forEach((card, c) => card.highlight(c === nextChar));

    const attackBtn = document.createElement('button');
    attackBtn.className = 'btn-primary';
    attackBtn.textContent = 'Attack';
    attackBtn.addEventListener('click', () => this.enterTargetSelection({ type: 'attack' }));
    this.actionButtonsEl.appendChild(attackBtn);

    nextChar.skills.forEach((skill, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-blue';
      const onCd = skill.currentCooldown > 0;
      btn.textContent = onCd ? `${skill.name} (cd:${skill.currentCooldown})` : skill.name;
      btn.disabled = onCd;
      btn.addEventListener('click', () => {
        if (skill.targetType === 'self') {
          // Execute immediately — no target pick needed
          this.executePlayerAction(nextChar, 'skill', idx); // pass self as target
        } else {
          this.enterTargetSelection({ type: 'skill', skillIdx: idx });
        }
      });
      this.actionButtonsEl.appendChild(btn);
    });
  }

  private hideActionButtons(): void {
    this.actionButtonsEl.innerHTML = '';
    this.cancelTargetSelection();
    this.cards.forEach(card => card.highlight(false));
  }

  /** Phase 2: make enemy cards clickable targets */
  private enterTargetSelection(action: { type: 'attack' | 'skill'; skillIdx?: number }): void {
    this.pendingAction = action;

    // Update action-label to guide the player
    const label = this.actionButtonsEl.previousElementSibling as HTMLElement | null;
    if (label?.classList.contains('action-label')) {
      label.textContent = 'Choose Target ▶';
      label.style.color = 'var(--red-glow)';
    }

    // Grey out action buttons — show Cancel instead
    this.actionButtonsEl.innerHTML = '';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'font-size:0.65rem;padding:4px 10px;background:#1a1a2a;border-color:#3d3d5c;color:#8888aa;';
    cancelBtn.addEventListener('click', () => {
      this.cancelTargetSelection();
      this.showActionButtons();
      const lbl = this.actionButtonsEl.previousElementSibling as HTMLElement | null;
      if (lbl?.classList.contains('action-label')) {
        lbl.textContent = 'Choose Action';
        lbl.style.color = '';
      }
    });
    this.actionButtonsEl.appendChild(cancelBtn);

    // Make each alive enemy card a clickable target
    this.manager.enemyTeam.TeamMate.forEach(enemy => {
      if (enemy.hp <= 0) return;
      const card = this.cards.get(enemy);
      if (!card) return;

      card.setTargetable(true);
      const handler = () => {
        if (!this.pendingAction) return;
        const { type, skillIdx } = this.pendingAction;
        this.executePlayerAction(enemy, type, skillIdx);
        // Reset label
        const lbl = this.actionButtonsEl.previousElementSibling as HTMLElement | null;
        if (lbl?.classList.contains('action-label')) {
          lbl.textContent = 'Choose Action';
          lbl.style.color = '';
        }
      };
      card.getElement().addEventListener('click', handler);
      this.targetCleanups.push(() => {
        card.getElement().removeEventListener('click', handler);
        card.setTargetable(false);
      });
    });
  }

  /** Remove all target-selection state without executing */
  private cancelTargetSelection(): void {
    this.pendingAction = null;
    this.targetCleanups.forEach(fn => fn());
    this.targetCleanups = [];
  }

  private executePlayerAction(target: Character, type: 'attack' | 'skill', skillIdx?: number): void {
    this.cancelTargetSelection();
    this.hideActionButtons();

    const nextChar = this.manager.peekNextChar();
    if (!nextChar) return;

    this.manager.playerActionOverride = (activeChar: Character, _autoTarget: Character): string => {
      if (type === 'skill' && skillIdx !== undefined) {
        const skill = activeChar.skills[skillIdx];
        skill.currentCooldown = skill.cooldown;
        return skill.execute(activeChar, target);
      }
      return activeChar.attack(target);
    };

    // Suppress unused param warning
    void nextChar;

    const result = this.manager.nextTurn();
    this.lastBattleLog = result;
    this.log.add(result);
    this.updateAllCards();

    if (this.manager.isBattleEnds) { this.endGame(); return; }
    setTimeout(() => this.advance(), 200);
  }

  private runEnemyTurn(): void {
    const result = this.manager.nextTurn();
    this.lastBattleLog = result;
    this.log.add(result);
    this.updateAllCards();
    if (this.manager.isBattleEnds) { this.endGame(); return; }
    setTimeout(() => this.advance(), 300);
  }

  private endGame(): void {
    this.setTurnIndicator('ended');
    this.hideActionButtons();

    const won = this.manager.isPlayerWin === true;
    const overlay = document.createElement('div');
    overlay.className = 'battle-overlay';

    const box = document.createElement('div');
    box.className = 'overlay-box';

    // ── Heading ──
    const heading = document.createElement('h2');
    heading.className = won ? 'victory' : 'defeat';
    heading.textContent = won ? '🏆 VICTORY' : '💀 DEFEAT';

    // ── Cause block ──
    const causeBlock = document.createElement('div');
    causeBlock.className = 'overlay-cause';
    const causeTitle = document.createElement('div');
    causeTitle.className = 'overlay-cause-title';
    causeTitle.textContent = 'Final Action';
    const causeText = document.createElement('pre');
    causeText.className = 'overlay-cause-text';
    causeText.textContent = this.lastBattleLog || '—';
    causeBlock.appendChild(causeTitle);
    causeBlock.appendChild(causeText);

    // ── Survivor summary ──
    const summaryBlock = document.createElement('div');
    summaryBlock.className = 'overlay-summary';

    const makeSideCol = (label: string, chars: Character[], accentVar: string) => {
      const col = document.createElement('div');
      col.className = 'overlay-summary-col';

      const colLabel = document.createElement('div');
      colLabel.className = 'overlay-summary-label';
      colLabel.style.color = `var(${accentVar})`;
      colLabel.textContent = label;
      col.appendChild(colLabel);

      chars.forEach(c => {
        const row = document.createElement('div');
        row.className = 'overlay-summary-row';

        const alive = c.hp > 0;
        const icon = document.createElement('span');
        icon.textContent = alive ? '⚔' : '💀';
        icon.style.opacity = alive ? '1' : '0.5';

        const charName = document.createElement('span');
        charName.textContent = c.name;
        charName.style.cssText = `flex:1;text-align:left;${alive ? '' : 'text-decoration:line-through;opacity:0.5;'}`;

        const hpText = document.createElement('span');
        hpText.className = 'overlay-summary-hp';
        hpText.textContent = alive ? `${c.hp} / ${c.maxHp}` : 'Fallen';
        hpText.style.color = alive
          ? c.hp / c.maxHp > 0.5 ? 'var(--green)'
          : c.hp / c.maxHp > 0.25 ? 'var(--gold)'
          : 'var(--red-glow)'
          : 'var(--text-muted)';

        row.appendChild(icon);
        row.appendChild(charName);
        row.appendChild(hpText);
        col.appendChild(row);
      });

      return col;
    };

    summaryBlock.appendChild(makeSideCol('Your Party', this.manager.playerTeam.TeamMate, '--red-glow'));

    const dividerLine = document.createElement('div');
    dividerLine.style.cssText = 'width:1px;background:var(--border-bright);align-self:stretch;';
    summaryBlock.appendChild(dividerLine);

    summaryBlock.appendChild(makeSideCol('Enemy Party', this.manager.enemyTeam.TeamMate, '--blue-glow'));

    // ── Play Again ──
    const again = document.createElement('button');
    again.className = 'btn-primary';
    again.textContent = 'Play Again';
    again.addEventListener('click', () => { overlay.remove(); this.newGame(); });

    box.appendChild(heading);
    box.appendChild(causeBlock);
    box.appendChild(summaryBlock);
    box.appendChild(again);
    overlay.appendChild(box);
    document.getElementById('app')!.appendChild(overlay);
  }

  private setTurnIndicator(mode: 'player' | 'enemy' | 'ended'): void {
    this.turnIndicatorEl.className = 'turn-indicator';
    if (mode === 'player') {
      this.turnIndicatorEl.classList.add('player-turn');
      const next = this.manager.peekNextChar();
      this.turnIndicatorEl.textContent = `YOUR TURN — ${next?.name ?? ''}`;
    } else if (mode === 'enemy') {
      this.turnIndicatorEl.classList.add('enemy-turn');
      this.turnIndicatorEl.textContent = 'Enemy thinking...';
    } else {
      this.turnIndicatorEl.classList.add('ended');
      this.turnIndicatorEl.textContent = 'Battle Ended';
    }
  }
}