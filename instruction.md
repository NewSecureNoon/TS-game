Adjusted Project Instructions

1. Project Overview & Objectives
   The goal of this project is to build a core prototype for a Turn based Game Battle Engine using TypeScript.

Core Features to Implement:
Turn-Based Combat System: A state-driven combat system managed by a central manager.

Data Models: Manage Player, Enemy, Party, and Skill stats using Object-Oriented Programming (OOP) and strict TypeScript interfaces.

2. Tech Stack & Environment Setup
   Prerequisites
   Node.js (v18+ recommended)

Code Editor (VS Code)

tsconfig.json Configuration
Ensure your project enforces strict typing with the following settings:

JSON
{
"compilerOptions": {
"target": "ES2022",
"module": "ESNext",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"moduleResolution": "node"
}
} 3. Architecture & Suggested Folder Structure
Note: Cleaned up and organized into standard TypeScript architectural patterns.

Plaintext 3. Architecture & File Structure

Organize your project into a scalable folder structure.

current folder structure
src/

├── classes/

| ├── Character.ts

| ├── Effect.ts

| ├──Party.ts

| ├── Roles.ts

| ├──Skill.ts

| ├──SkillData.ts

├── interfaces/

| ├── Character.interface.ts

| ├──Effect.interface.ts

├── systems/

| ├──BattleManager.ts

| ├──HelperFunction.ts

└── main.ts # Entry point

index.html

you can suggest me about folder structure 4. Implementation Strategy & Planning (AI Workflow)
Before writing any code, you (the AI) must provide a step-by-step implementation plan.

For each major step, your proposal must include:
Objective: What specific component or feature you will build.

Pros & Cons: The advantages and drawbacks of choosing this specific implementation approach (e.g., State Machine vs. Simple Conditional logic for BattleManager).

Approval Gate: You must wait for my explicit approval ("Approved", "Proceed", etc.) before writing the actual code for that step.

5. Feature Requirements & Bug Fixes

5.1 Simulation Mode Enhancements & Bug Fixes

5.1.1 Party Selection for Simulation
Objective: Allow users to explicitly choose which party Team 1 and Team 2 will play before starting the simulation.

Requirements:

- Create a party selection UI screen that appears before the simulation battle begins
- Display available parties: The Couple of Wrath, The Iron Bison, and Random
- Allow user to select party for Team 1 and independently select party for Team 2
- Store selected parties in a configuration object before initializing the BattleManager
- Pass party selections to BattleManager initialization (modify constructor as needed)

Implementation Notes:

- Modify main.ts entry point to include party selection logic
- Update BattleManager constructor to accept party configuration parameters
- Ensure Party.ts class can instantiate different party types based on selection
- Update index.html with UI elements for party selection dropdowns/buttons

  5.1.2 UI Bug Fix: Reinforcement Character Display
  Objective: Fix the bug where "Paladin Leader" calls for reinforcements, but the newly spawned "Knight" does not appear/render in the team UI.

Issue Description:

- When "Paladin Leader" skill triggers reinforcement (spawning a new Knight), the character is created in the Party data model
- However, the DOM/UI does not update to reflect the new character in the team UI panel
- Root cause likely involves asynchronous timing or missing UI refresh after character spawning

Requirements:

- Identify the reinforcement triggering mechanism in BattleManager and Skill systems
- Ensure Party class properly adds the new Knight character to its roster
- Update BattleManager to trigger a UI re-render after reinforcement spawning
- Verify that HelperFunction or UI update methods are called after character additions
- Test that reinforced Knight appears in team UI immediately upon spawning

Implementation Notes:

- Review Character.ts for reinforcement spawn logic
- Check Party.ts addCharacter() or similar methods for completeness
- Verify BattleManager has a refreshTeamUI() or updateTeamDisplay() method
- Ensure HTML team panels are updated dynamically with the new character element

---

5.2 Player vs Bot Mode Enhancements

5.2.1 Player Party Selection
Objective: Allow the player to choose their party from explicit options before starting a Player vs Bot battle.

Available Party Options:

- The Couple of Wrath
- The Iron Bison (Note: Corrected from "Biston" to "Bison")
- Random (system randomly selects a party)

Requirements:

- Create a dedicated party selection screen/UI for Player vs Bot mode
- Display three radio buttons or selectable options for party choice
- Upon selection, store the player's party choice in a variable
- Pass the selected party to BattleManager for Team 1 initialization
- Trigger bot party selection immediately after player selection

Implementation Notes:

- Add party selection modal or panel to index.html for Player vs Bot mode
- Ensure selection UI is distinct from Simulation mode selection
- Implement a function to randomly select a party when "Random" is chosen
- Update main.ts to handle player vs bot party selection flow

  5.2.2 Bot Party Selection
  Objective: Allow the player to select the opponent Bot's party using the same choices available to the player.

Available Bot Party Options:

- The Couple of Wrath
- The Iron Bison
- Random (system randomly selects a party for the bot)

Requirements:

- Create a secondary UI panel for Bot party selection (displayed after player selection or simultaneously)
- Bot can independently select the same three party options as the player
- If bot selects "Random", use the same random selection logic as player
- Pass bot's selected party to BattleManager for Team 2 initialization
- Ensure both player and bot parties are set before battle commences

Implementation Notes:

- Implement a bot selection logic function in HelperFunction.ts or a new file
- Allow player to manually choose bot party OR implement AI-driven bot selection logic
- Store bot party selection and pass to BattleManager Team 2 setup
- Ensure UI clearly displays which party each team (player and bot) has selected

---

5.3 Battle & Character Mechanics

5.3.1 Counter-Attack Restriction on Stunned Status
Objective: Update character mechanics so that characters with the "Counter" passive (Punishment) cannot trigger a counter-attack while under the "Stunned" status.

Current Behavior:

- Characters with "Counter" (Punishment) passive normally trigger automatic counter-attacks when hit
- This currently works regardless of the character's status condition

Desired Behavior:

- If a character is in "Stunned" status, the Counter passive should be disabled/suppressed
- When stunned, incoming attacks do NOT trigger counter-attacks
- Once the Stunned status expires, the Counter passive resumes normal operation

Requirements:

- Modify Character.ts to track and respect status conditions when evaluating passives
- Update counter-attack logic in BattleManager to check for "Stunned" status before allowing counter
- Ensure the check is performed in the attack/damage resolution phase
- Add a method in Character.ts: canUseCounter() that returns false if stunned

Implementation Notes:

- Review Effect.ts to understand how Stunned status is applied and tracked
- Modify the counter-attack trigger mechanism in BattleManager
- Add guard clause: if (character.hasStatus('stunned')) { skip counter logic }
- Test that stunned characters do NOT counter, and counter resumes after stun expires

  5.3.2 Character Status Display (Buffs, Debuffs, Passives)
  Objective: Update the Character UI/State to clearly display all active Buffs, Debuffs, and Passives that the character currently has.

Current State:

- Characters have buffs, debuffs, and passives applied during battle
- These effects may not be visually represented in the UI

Desired State:

- UI clearly shows all active buffs (positive effects)
- UI clearly shows all active debuffs (negative effects/statuses)
- UI clearly shows all passive abilities that the character has
- Effects are displayed in a dedicated section of the character UI panel

Requirements:

- Create a new UI section within each character's display panel for status effects
- Display active buffs with clear visual indicators (icons, labels, duration if applicable)
- Display active debuffs with distinct visual styling (red/warning color)
- Display character's passive abilities as a separate list or section
- Update this display dynamically as effects are applied and expire

Implementation Notes:

- Modify Character.interface.ts to ensure buff/debuff/passive arrays are accessible
- Update the HTML character panel template in index.html to include a status effects section
- Create a utility function in HelperFunction.ts: displayCharacterStatus() or similar
- Use Effect.ts to retrieve effect names, types (buff/debuff), and durations
- Hook this display function into BattleManager's turn cycle to refresh after each action
- Ensure display updates when effects are applied and when they expire

---

5.4 Implementation Priority & Approval Gates

Phase 1 (Simulation Mode - High Priority):

- [ ] Party Selection for Simulation (Section 5.1.1)
- [ ] UI Bug Fix: Reinforcement Display (Section 5.1.2)

Phase 2 (Player vs Bot Mode - High Priority):

- [ ] Player Party Selection (Section 5.2.1)
- [ ] Bot Party Selection (Section 5.2.2)

Phase 3 (Character Mechanics - Medium Priority):

- [ ] Counter-Attack Restriction on Stunned (Section 5.3.1)
- [ ] Character Status Display UI (Section 5.3.2)

Before implementing each phase, a detailed step-by-step implementation plan with Pros & Cons must be submitted for approval.
