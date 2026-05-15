export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPartyDescription(partyName: string): string {
  const normalizedName = partyName.toLowerCase().trim();

  if (normalizedName === 'the couple of wrath') {
    return `<strong>The Couple of Wrath</strong><br/>
      <span style="color: #27ae60;">✓ MadnessBerserker (Berserker)</span> - Grows stronger as HP decreases (up to 80% bonus ATK)<br/>
      <span style="color: #27ae60;">✓ WarDrummer (War Drummer)</span> - Team ATK boost (+25%) and self-destruct explosion on death<br/>
      <span style="color: #b2d917ff;">✓ Special:</span> When WarDrummer dies, MadnessBerserker gains Counter Attack ability`;
  }

  if (normalizedName === 'the iron bison') {
    return `<strong>The Iron Bison</strong><br/>
      <span style="color: #27ae60;">✓ PaladinLeader (Paladin Leader)</span> - High defense and Shield Bash (20% chance to stun attackers)<br/>
      <span style="color: #27ae60;">✓ Knights (2x)</span> - Defensive units that can Block incoming attacks<br/>
      <span style="color: #b2d917ff;">✓ Special:</span> PaladinLeader can summon additional Knights to reinforce the team`;
  }

  return '';
}
