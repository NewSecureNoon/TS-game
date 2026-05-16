import type { Character } from '../classes/Character.ts';
import type { Party } from '../classes/Party.ts';

export class BattleManager {
  public playerTeam: Party;
  public enemyTeam: Party;
  public turnOrder: Character[] = [];
  public isBattleEnds: boolean = false;
  public isPlayerWin: boolean | null = null;
  private turnCounter: number = 0;

  // Step 5: Hook for player-controlled action injection
  public playerActionOverride: ((char: Character, target: Character) => string) | null = null;

  constructor(player: Party, enemy: Party) {
    this.playerTeam = player;
    this.enemyTeam = enemy;

    const allChar: Character[] = player.TeamMate.concat(enemy.TeamMate);
    allChar.forEach(char => char.battleManager = this);
    this.turnOrder = allChar.sort((a, b) => b.speed - a.speed);
  }

  // ── Immediate win/loss detection ─────────────────────────────────────────
  /** Returns a result string if the battle is now over, otherwise null. */
  private checkBattleEnd(): string | null {
    const allEnemiesDead  = this.enemyTeam.TeamMate.every(c => c.hp <= 0);
    const allPlayersDead  = this.playerTeam.TeamMate.every(c => c.hp <= 0);

    if (allEnemiesDead || allPlayersDead) {
      this.isBattleEnds = true;
      this.isPlayerWin  = allEnemiesDead && !allPlayersDead;
      return this.isPlayerWin
        ? '🏆 Victory! All enemies have been defeated.'
        : '💀 Defeat! Your entire party has fallen.';
    }
    return null;
  }

  // ── Dead character cleanup ────────────────────────────────────────────────
  /**
   * Remove every character with hp <= 0 from the turn queue.
   * Called at the START of nextTurn() (catches deaths from counter-attacks / AoE
   * that happened outside this turn) and AFTER every action resolves (catches
   * kills made this turn). Keeps peekNextChar() and shift() always in sync.
   */
  private pruneDead(): void {
    this.turnOrder = this.turnOrder.filter(c => c.isAlive);
  }


  nextTurn(): string {
    this.turnCounter += 1;

    // Remove any characters that died since the last turn (e.g. from counter-
    // attacks or AoE) so that shift() and peekNextChar() always agree.
    this.pruneDead();

    const activeChar = this.turnOrder.shift();
    activeChar?.showDetail()

    if (!activeChar) {
      this.isBattleEnds = true;
      return `Turn ${this.turnCounter}: No more characters in queue.`;
    }

    // Safety guard — should not trigger after pruneDead(), but kept as fallback.
    if (!activeChar.isAlive) {
      const endResult = this.checkBattleEnd();
      if (endResult) return endResult;
      return `Turn: [${activeChar.name}] ${activeChar.role} is fallen and skipped.`;
    }

    activeChar.updateCooldowns();

    if (activeChar.isStunned) {
      this.turnOrder.push(activeChar);
      activeChar.updateStatusEffects();
      return `[Turn: ${activeChar.name}] is Stunned and cannot move!`;
    } else {
      activeChar.updateStatusEffects();
    }

    // Guard: if no live targets exist, end now (e.g. all died to DoT this tick)
    const enemies = activeChar.getOpponents().filter(e => e.hp > 0);
    if (enemies.length === 0) {
      const endResult = this.checkBattleEnd();
      if (endResult) return endResult;
      // Fallback (should not reach here, but keeps TS happy)
      this.isBattleEnds = true;
      this.isPlayerWin  = this.playerTeam.TeamMate.includes(activeChar);
      return this.isPlayerWin ? 'Victory! No enemies left.' : 'Defeat! Your party has fallen.';
    }

    const target = enemies[Math.floor(Math.random() * enemies.length)];

    // Step 5: Use player override if this character belongs to player team and override is set
    let log: string;
    const isPlayerChar = this.playerTeam.TeamMate.includes(activeChar);
    if (isPlayerChar && this.playerActionOverride) {
      log = this.playerActionOverride(activeChar, target);
      this.playerActionOverride = null;
    } else {
      log = activeChar.makeAction(target);
    }

    if (activeChar.isAlive) {
      this.turnOrder.push(activeChar);
    }

    // Prune any characters killed by this action (including counter-attack victims)
    // before checking battle end or returning, so the queue stays clean for
    // the next peekNextChar() / isNextTurnPlayer() call.
    this.pruneDead();

    // ── Check win/loss IMMEDIATELY after every action ──────────────────────
    const endResult = this.checkBattleEnd();
    if (endResult) {
      return `[Turn: ${activeChar.name}]\n${log}\n${endResult}`;
    }

    return `[Turn: ${activeChar.name}]\n${log}`;
  }

  public peekNextChar(): Character | undefined {
    return this.turnOrder.find(c => c.isAlive);
  }

  public isNextTurnPlayer(): boolean {
    const next = this.peekNextChar();
    if (!next) return false;
    return this.playerTeam.TeamMate.includes(next);
  }

  public getTeammates(char: Character): Character[] {
    return this.playerTeam.TeamMate.includes(char)
      ? this.playerTeam.TeamMate
      : this.enemyTeam.TeamMate;
  }
}