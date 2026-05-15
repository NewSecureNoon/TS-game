# 📖 GameInfo — Battle Engine

Complete reference for all parties, characters, passives, active skills, status effects, and combat mechanics.

---

## ⚔ Combat Basics

### Turn Order
All characters are sorted by **Speed** at the start of battle — highest Speed acts first.  
Each turn a character:
1. Has their skill cooldowns ticked down
2. Is checked for **Stunned** (skips action if stunned)
3. Picks a target from the **opposing team** (alive only)
4. Resolves an action (attack or skill)

### Damage Formula
```
Final Damage = max(0, ATK − target.DEF)
```
If the target has the **Blocking** buff active, there is a **35% chance** (roll > 0.65) to completely negate the hit.

### Miss Chance (Blocking Attacker)
If the **attacker** has the **Blocking** buff active, there is a **40% chance** (roll ≤ 0.4) their own attack misses entirely.

### Victory Condition
Battle ends **immediately** when:
- All enemies have `HP ≤ 0` → **Victory**
- All player characters have `HP ≤ 0` → **Defeat**

---

## 🔴 Party 1 — The Couple of Wrath

A high-risk, high-reward duo. The WarDrummer acts as an enabler who boosts the whole team's ATK and unleashes a devastating explosion on death — and empowers the Berserker further when she falls.

### Roster

| Character | Role | HP | ATK | DEF | SPD |
|---|---|---|---|---|---|
| **MadnessBerserker** | Berserker | 350 | 100 *(+scaling)* | 15 | 20 |
| **WarDrummer** | War Drummer | 150 | 75 | 15 | 5 |

---

### 🔥 MadnessBerserker

**Role:** Primary damage dealer.  
**Playstyle:** Becomes exponentially more dangerous as she loses HP. Fragile early, devastating when wounded.

#### Passives

| Passive | Type | Effect |
|---|---|---|
| **Berserk's Fury** | Scaling Passive | Increases ATK by up to **+80%** based on missing HP. Formula: `ATK × (1 − HP/MaxHP) × 0.80`. At 1 HP she gains nearly +80 bonus ATK. |
| **The Punishment** *(unlocked)* | Conditional Passive | Unlocked when WarDrummer dies (via *The Comrade*). Automatically **counter-attacks** every incoming hit. Counter cannot trigger while Stunned. |

#### Active Skills
*None by default.*  
> The Punishment passive is gained mid-battle and acts automatically — no action required.

---

### 🥁 WarDrummer

**Role:** Support / sacrifice enabler.  
**Playstyle:** Fragile and slow but provides a persistent team ATK boost. Death triggers a chain of powerful effects.

#### Passives

| Passive | Type | Effect |
|---|---|---|
| **War Spirit** | Team Passive | Grants **+25% ATK** to all teammates (including self) as long as WarDrummer is on the field. Lost when she dies. |
| **The Comrade** | Death Passive | On death: grants **The Punishment** (counter-attack passive) to every **Berserker** teammate who doesn't already have it. |
| **Self Destruction** | Death Passive | On death: deals **275 fixed damage** to **all living enemies** (ignores DEF, cannot be countered). |

#### Active Skills
*None.*

---

### 🔴 Party Synergy

```
WarDrummer alive  → All teammates +25% ATK  
WarDrummer dies   → MadnessBerserker gains Counter-Attack  
                 → All enemies take 275 fixed AoE damage  
MadnessBerserker low HP → Up to +80% ATK bonus from Berserk's Fury  
```

**Ideal scenario:** WarDrummer dies in the middle of battle, dealing a large AoE hit, granting MadnessBerserker her counter passive — who then rampages at low HP with massive ATK.

---

## 🔵 Party 2 — The Iron Bison

A durable defensive squad that stalls, disrupts with Stun, and reinforces its ranks with additional Knights mid-battle.

### Roster

| Character | Role | HP | ATK | DEF | SPD |
|---|---|---|---|---|---|
| **PaladinLeader** | Paladin Leader | 350 | 100 | 100 | 15 |
| **Knight** *(×1 initial, +reinforcements)* | Knight | 100 | 80 | 35 | 7 |

---

### 🛡 PaladinLeader

**Role:** Tank and force multiplier.  
**Playstyle:** Extremely hard to kill. Every hit she lands has a chance to stun the target, interrupting their turns. Can summon additional Knights to overwhelm the enemy through numbers.

#### Passives

| Passive | Type | Effect |
|---|---|---|
| **Shield Bash** | Conditional Passive | On every successful hit: **25% chance** (roll > 0.75) to apply **Stunned (1 turn)** to the target. Stunned characters skip their next turn. |

#### Active Skills

| Skill | Cooldown | Target | Effect |
|---|---|---|---|
| **Call Reinforcement** | 3 turns | Self | Spawns a new **Knight** onto the field. The Knight joins the turn queue immediately. Can be used multiple times. |

---

### ⚔ Knight

**Role:** Secondary attacker / blocker.  
**Playstyle:** Low HP but decent DEF. Uses Block to negate incoming hits. More Knights = more collective HP and action economy for the Iron Bison.

#### Passives
*None.*

#### Active Skills

| Skill | Cooldown | Target | Effect |
|---|---|---|---|
| **Block** | 0 turns *(toggle)* | Self | Toggles the **Blocking** buff ON or OFF. While active: **35% chance** to completely negate any incoming attack. However, the Knight's own attacks have a **40% chance to miss** while blocking. |

---

### 🔵 Party Synergy

```
PaladinLeader attacks → 25% chance to Stun target (skip their turn)  
PaladinLeader skill   → Summons new Knight (every 3 turns)  
Knight uses Block     → 35% damage negation, trades off 40% miss chance  
Multiple Knights      → More HP pool, more actions per round, more Block coverage  
```

**Ideal scenario:** PaladinLeader stuns MadnessBerserker before she can act at low HP, while an army of Knights chip away at the enemy team and share the incoming damage load.

---

## 🎲 Status Effects

| Effect | Type | Duration | Mechanic |
|---|---|---|---|
| **Stunned** | Debuff | 1 turn | Character cannot act. Counter-attack is also suppressed while stunned. Expires after the affected character's next turn. |
| **Blocking** | Buff | ∞ *(toggled)* | 35% chance to fully block incoming damage. Attacker suffers 40% miss chance on their own attacks. Toggled off by using the Block skill again. |
| **Attack Boost** | Buff | Variable | Increases ATK by a multiplier for a set number of turns. |
| **Defense Boost** | Buff | Variable | Increases DEF by a multiplier for a set number of turns. |
| **Speed Boost** | Buff | Variable | Increases SPD by a multiplier for a set number of turns. |
| **Attack Down** | Debuff | Variable | Reduces ATK by a multiplier. |
| **Defense Down** | Debuff | Variable | Reduces DEF by a multiplier. |
| **Speed Down** | Debuff | Variable | Reduces SPD by a multiplier. |

---

## ⚙ Mechanic Deep Dives

### Counter-Attack (The Punishment)
- Triggers **automatically** whenever MadnessBerserker (with the passive) is hit.
- Counter damage = attacker's full ATK stat (including Berserk's Fury bonus).
- Counter hits are flagged `isCounter: true` → the target **cannot** counter back (prevents infinite loops).
- Counter is **suppressed** if the character is currently Stunned.

### Self Destruction (WarDrummer)
- Triggers on death **before** the battle-end check.
- Deals **275 fixed damage** to all living enemies simultaneously.
- This damage is flagged `isCounter: true` → enemies cannot counter back.
- Can kill multiple enemies or end the battle in the same moment WarDrummer dies.

### Reinforcement (Call Reinforcement)
- Each summoned Knight is named `Knight 3`, `Knight 4`, etc.
- New Knight will enter part of the `turnOrder` queue at the **end** (lowest priority on spawn).
- The PaladinLeader can use the skill repeatedly every 3 turns.

### Berserk's Fury Scaling
```
Bonus ATK = ATK × missingHPRatio × 0.80
Total ATK = baseATK + bonusATK

Example at 70 HP remaining (out of 350):
  missingHPRatio = (350 - 70) / 350 = 0.80
  bonusATK       = 100 × 0.80 × 0.80 = 64
  Total ATK      = 164
```

### Block Probabilities Summary

| Situation | Roll | Outcome |
|---|---|---|
| Defender has Block buff | > 0.65 | Attack fully negated |
| Defender has Block buff | ≤ 0.65 | Normal damage (ATK − DEF) |
| Attacker has Block buff | > 0.40 | Attack lands normally |
| Attacker has Block buff | ≤ 0.40 | Attacker misses |

---

## 🆚 Party Matchup Overview

| | The Couple of Wrath | The Iron Bison |
|---|---|---|
| **Strength** | Explosive burst, death synergy, counter spam | High durability, Stun control, reinforcement economy |
| **Weakness** | Low DEF, WarDrummer is very fragile | Slow to kill enemies, reliant on numbers |
| **Peak condition** | WarDrummer dead, Berserker at low HP with Counter | 3+ Knights alive, PaladinLeader stunning key targets |
| **Counter strategy** | Kill WarDrummer fast to avoid Comrade trigger, focus Berserker before she scales | Stun Berserker at critical HP, body-block with Knights |
