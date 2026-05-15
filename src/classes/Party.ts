import type { Character } from './Character.ts';
import { MadnessBerserker, WarDrummer, PaladinLeader, Knight } from './Roles.ts';

export abstract class Party {
  public name: string;
  private member: Character[];

  constructor(name: string, member: Character[]) {
    this.name = name;
    this.member = member;
  }

  get MemberInfo(): object {
    const rolesCount = this.member.reduce((arr, char) => {
      arr[char.role] = (arr[char.role] || 0) + 1;
      return arr;
    }, {} as Record<string, number>);
    return rolesCount;
  }

  get TeamMate(): Character[] {
    return this.member;
  }
}

export class RedParty extends Party {
  constructor(name: string, member: Character[]) {
    super(name, member);
  }
}

export class BlueParty extends Party {
  constructor(name: string, member: Character[]) {
    super(name, member);
  }
}

/**
 * Factory function to create parties by name
 * Available parties:
 * - "The Couple of Wrath" (Red party)
 * - "The Iron Bison" (Blue party)
 * - "Random" (randomly selects one of the above)
 */
export function createPartyByName(partyName: string, isRedTeam: boolean): Party {
  const normalizedName = partyName.toLowerCase().trim();
  var controlledBy: string | null = null;
  if (isRedTeam) {
    controlledBy = "Player"
  } else {
    controlledBy = "Bot"
  }
  if (normalizedName === 'random') {
    const options = ['The Couple of Wrath', 'The Iron Bison'];
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    return createPartyByName(randomChoice, isRedTeam);
  }

  if (normalizedName === 'the couple of wrath') {
    const members: Character[] = [
      new MadnessBerserker("Valerius", controlledBy),
      new WarDrummer("Valeria", controlledBy),
    ];
    return isRedTeam ? new RedParty('The Couple of Wrath', members) : new BlueParty('The Couple of Wrath', members);
  }

  if (normalizedName === 'the iron bison') {
    const members: Character[] = [
      new PaladinLeader("Conrad", controlledBy),
      new Knight("Knight 1", controlledBy),
      new Knight("Knight 2", controlledBy),
    ];
    return isRedTeam ? new RedParty('The Iron Bison', members) : new BlueParty('The Iron Bison', members);
  }

  // Default fallback
  throw new Error(`Unknown party name: ${partyName}`);
}