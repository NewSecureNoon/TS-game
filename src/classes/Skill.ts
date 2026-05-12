import { Character } from './Character';

export abstract class Skill {
    public name: string;
    public description: string;
    public manaCost: number;
    constructor(name: string, description: string, manaCost: number) {
        this.name = name;
        this.description = description;
        this.manaCost = manaCost;
    }

    abstract execute(user: Character, target?: Character): string;
}


export abstract class PassiveSkill extends Skill {
    public statModifier: "atk" | "def" | "speed";
    public multiplier: number;

    constructor(name: string, description: string, statModifier: "atk" | "def" | "speed", multiplier: number) {
        super(name, description, 0);
        this.statModifier = statModifier;
        this.multiplier = multiplier;
    }

    abstract getCurrentBonus(owner: Character): number;

    execute(user: Character): string {
        return `${user.name} possesses ${this.name}: ${this.description}`;
    }
}

export class ConditionalPassive extends PassiveSkill {
    public condition: (owner: Character) => boolean;

    constructor(
        name: string,
        description: string,
        stat: 'atk' | 'def' | 'speed',
        multiplier: number,
        condition: (owner: Character) => boolean
    ) {
        super(name, description, stat, multiplier);
        this.condition = condition;
    }

    // สำหรับเช็คว่าเงื่อนไขผ่านหรือไม่ (โดยไม่สนเรื่อง Bonus พลัง)
    isConditionMet(owner: Character): boolean {
        return this.condition(owner);
    }

    getCurrentBonus(owner: Character): number {
        return this.isConditionMet(owner) ? this.multiplier : 0;
    }
}

export class ScalingPassive extends PassiveSkill {
    private maxBonus: number;
    private scalingLogic: (owner: Character) => number;
    constructor(
        name: string, 
        description: string, 
        stat: 'atk' | 'def' | 'speed', 
        maxBonus: number,
        scalingLogic: (owner: Character) => number,
    ) {
        super(name, description, stat, 0);
        this.maxBonus = maxBonus;
        this.scalingLogic = scalingLogic;
    }

    getCurrentBonus(owner: Character): number {
        // เรียกใช้ฟังก์ชันที่ส่งมาตอนสร้าง Object
        const currentRatio = this.scalingLogic(owner); 
        
        // ป้องกันค่าเกินขอบเขต 0-1 (Clamp)
        const clampedRatio = Math.max(0, Math.min(1, currentRatio));
        
        return clampedRatio * this.maxBonus;
    }

}


export const BerserkFury = new ScalingPassive(
    "Berserk's Fury",
    "เพิ่ม Atk ตามเลือดที่เสียไป (สูงสุด 80%)",
    'atk',
    0.8,
    (owner) => 1 - (owner.hp / owner.maxHp)
);

export const Punishment = new ConditionalPassive(
    "The Punishment",
    "สวนกลับทุกครั้งเมื่อโดนโจมตี",
    'atk',
    0,
    (owner) => true
);