import type { IStatusEffect } from "../interfaces/Effect.interface";
import type { Character } from "./Character";


export class Buff implements IStatusEffect {
    public name: string;
    public type: "Buff" | "Debuff" = "Buff"
    public duration: number;
    public affectedStat: "atk" | "def" | "speed" | null;
    public multiplier: number;

    constructor(name: string, duration: number, affectedStat: "atk" | "def" | "speed" | null, multiplier: number) {
        this.name = name;
        this.duration = duration;
        this.affectedStat = affectedStat;
        this.multiplier = multiplier
    }

    onTurnStart(target: Character): void {
        this.duration--;
        console.log(`${this.name} is active on ${target.name} (${this.duration} turns left)`);
    }
}

export abstract class Debuff implements IStatusEffect {
    public name: string;
    public type: "Buff" | "Debuff" = "Debuff"
    public duration: number;
    public affectedStat: "atk" | "def" | "speed" | null;
    public multiplier: number;

    constructor(name: string, duration: number, affectedStat: "atk" | "def" | "speed" | null, multiplier: number) {
        this.name = name;
        this.duration = duration;
        this.affectedStat = affectedStat;
        this.multiplier = multiplier
    }

    onTurnStart(target: Character): void {
        this.duration--;
        console.log(`${this.name} is active on ${target.name} (${this.duration} turns left)`);
    }
}

export class AttackBoost extends Buff {
    constructor(duration: number, multiplier: number) {
        super("Attack Boost", duration, "atk", multiplier);
    }
}

export class DefenseBoost extends Buff {
    constructor(duration: number, multiplier: number) {
        super("Defense Boost", duration, "def", multiplier)
    }
}

export class SpeedBoost extends Buff {
    constructor(duration: number, multiplier: number) {
        super("Speed Boost", duration, "speed", multiplier)
    }
}

export class Block extends Buff {
    constructor() {
        super("Blocking", Infinity, null, 0)
    }
}

export class AttackDown extends Debuff {
    constructor(duration: number, multiplier: number) {
        super("Attack Down", duration, "atk", multiplier);
    }
}

export class DefenseDown extends Debuff {
    constructor(duration: number, multiplier: number) {
        super("Defense Down", duration, "def", multiplier)
    }
}

export class SpeedDown extends Debuff {
    constructor(duration: number, multiplier: number) {
        super("Speed Down", duration, "speed", multiplier)
    }
}

export class Stunned extends Debuff {
    constructor(duration: number) {
        super("Stunned", duration, null, 0)
    }
}