# TSgame

## About this project

This project was born out of a personal challenge to push my boundaries as a developer within a strict, time-boxed period from **May 11 to May 16, 2026**.

The core mission of this sprint was to self-assess and elevate my practical skills in **TypeScript** and **Object-Oriented Programming (OOP)**. I chose to build a **Turn-based Battle Game** because it demands a clean, scalable domain model that perfectly tests these concepts.

## Key Objectives

- **Time-Boxed Delivery:** Design, develop, and deploy a functional application within 5 days.
- **OOP Mastery:** Apply core Object-Oriented principles, including **Encapsulation, Inheritance, Polymorphism, and Abstraction**, to write clean and maintainable code.
- **Type Safety:** Leverage TypeScript’s robust type system to minimize runtime errors and ensure strict data integrity.

## ⚔ Battle Engine

A turn-based combat prototype built with **TypeScript** and **Vite**.  
Two parties clash in a stat-driven battle system with passives, active skills, status effects, and a live UI.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default: `http://localhost:5173`).

## 🎮 Game Modes

| Mode              | Description                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| **Simulation**    | Runs 100 automated battles at adjustable speed. Shows live win-rate analytics and character HP.          |
| **Player vs Bot** | You control the Red party. Choose an attack or skill each turn, then click an enemy card to target them. |

---

## 🗂 Project Structure

```
src/
├── classes/
│   ├── Character.ts      # Abstract base class — stats, attack, damage, passives
│   ├── Effect.ts         # Buff / Debuff / Stunned status effects
│   ├── Party.ts          # Party factory and team container
│   ├── Roles.ts          # Concrete character classes (MadnessBerserker, WarDrummer, …)
│   ├── Skill.ts          # ActiveSkill / PassiveSkill abstract classes + concrete skill types
│   └── SkillData.ts      # Shared skill / passive instances (BerserkFury, ShieldBash, …)
│
├── interfaces/
│   ├── Character.interface.ts
│   └── Effect.interface.ts
│
├── systems/
│   ├── BattleManager.ts  # Turn queue, action resolution, win/loss detection
│   └── HelperFunction.ts # Utility functions (getRandomInt, getPartyDescription)
│
├── ui/
│   ├── PlayerUI.ts       # Player vs Bot UI — turn flow, target selection, end-game overlay
│   ├── SimulationUI.ts   # Simulation dashboard — win rates, live HP cards, battle log
│   └── components/
│       ├── BattleLog.ts       # Scrollable combat log panel
│       ├── Charactercard.ts   # Character HP card with status badges
│       └── HpBar.ts           # Animated HP bar component
│
├── styles/
│   ├── base.css          # Design tokens, global resets, shared button styles
│   ├── player.css        # Player vs Bot layout and overlay styles
│   └── simulation.css    # Simulation dashboard layout and log styles
│
└── main.ts               # Entry point — landing page and mode routing

index.html
```

---

## 🏗 Architecture

### Turn System (`BattleManager`)

- All characters are sorted by **Speed** (descending) into a single `turnOrder` queue at battle start.
- Each call to `nextTurn()` pops the first alive character, resolves their action, then pushes them back to the end of the queue.
- Dead characters are **pruned from the queue** immediately after every action — preventing ghost turns.
- `checkBattleEnd()` is evaluated **after every action** (including mid-turn kills from counter-attacks) using `Array.every(c => c.hp <= 0)` on both teams.

### Skill Target Types

Active skills carry a `targetType` field:

| `targetType` | Behaviour                                                 |
| ------------ | --------------------------------------------------------- |
| `'enemy'`    | Player must click an enemy card to select a target        |
| `'self'`     | Skill executes immediately — no target selection required |

### Status Effects

Effects tick down one duration per turn via `updateStatusEffects()`.  
A `Block` buff has `duration: Infinity` and is toggled on/off by re-using the **Block** skill.

---

## 🛠 Tech Stack

| Tool                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| TypeScript (strict) | All game logic                                 |
| Vite                | Dev server & bundler                           |
| Vanilla CSS         | UI styling                                     |
| Google Fonts        | Cinzel (display), Share Tech Mono, Crimson Pro |

### `tsconfig.json` highlights

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "moduleResolution": "node"
  }
}
```

---

## 📖 Game Documentation

For full party composition, character stats, passives, and skill descriptions see **[GameInfo.md](./GameInfo.md)**.

---

## 🧠 Key Takeaways (What I Learned)

Completing this intensive 5-day challenge provided invaluable insights:

1.  **Architecture First:** When time is limited, spending the first few hours planning classes, interfaces, and relationships will save a massive amount of time later when debugging or extending the code later.
2.  **The Power of Interfaces:** Using TypeScript interfaces allowed me to decouple components effectively, making the code much easier to extend.
3.  **Scope Management:** I learned how to prioritize a Minimum Viable Product (MVP) and cut down "feature creep" to meet a hard deadline.
4.  **AI-Assisted Development:** AI tools are great at generate template code, but it's crucial to carefully review and test AI-generated code to ensure it meets project requirements and maintainability standards.

## Next Steps

1. add some unit tests for game testing
2. add or change some design pattern maybe state pattern or some pattern else.
3. another party or teams
