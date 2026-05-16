import type { Character } from './Character';
import type { Buff } from './Effect';

export abstract class Skill {
    public name: string;
    public description: string;
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

}


export abstract class PassiveSkill extends Skill {
    public statModifier: "atk" | "def" | "speed" | null;
    public multiplier: number;

    constructor(name: string, description: string, statModifier: "atk" | "def" | "speed" | null, multiplier: number) {
        super(name, description);
        this.statModifier = statModifier;
        this.multiplier = multiplier;
    }

    abstract getCurrentBonus(_owner: Character): number;

}


export abstract class ActiveSkill extends Skill {
    public cooldown: number;        // ค่ายืนพื้น (เช่น 5)
    public currentCooldown: number = 0; // ค่าที่ลดลงจริงในแต่ละเทิร์น
    public targetType: 'enemy' | 'ally' | 'all' | 'self' = 'enemy';

    constructor(name: string, description: string, cooldown: number, targetType: 'enemy' | 'ally' | 'all' | 'self') {
        super(name, description);
        this.cooldown = cooldown;
        this.targetType = targetType;
    }

    abstract execute(user: Character, target: Character): string;
}


export class ConditionalPassive extends PassiveSkill {
    public condition: (owner: Character) => boolean;

    constructor(
        name: string,
        description: string,
        stat: 'atk' | 'def' | 'speed' | null,
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
        stat: 'atk' | 'def' | 'speed' | null,
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


export class TeamPassive extends PassiveSkill {
    constructor(
        name: string,
        description: string,
        stat: 'atk' | 'def' | 'speed' | null,
        multiplier: number
    ) {
        super(name, description, stat, multiplier);
    }

    // สำหรับ TeamPassive โบนัสพื้นฐานคือตัว multiplier เอง
    getCurrentBonus(_owner: Character): number {
        return this.multiplier;
    }
}


export class CallReinforcementsSkill extends ActiveSkill {
    private getUnitClass: () => new (name: string, controlledBy: string | null) => Character; // เปลี่ยน Type

    constructor(
        name: string, description: string, cooldown: number,
        getUnitClass: () => new (name: string, controlledBy: string | null) => Character // รับเป็น function
    ) {
        super(name, description, cooldown, 'self');
        this.getUnitClass = getUnitClass;
    }

    public execute(user: Character): string {
        const UnitClass = this.getUnitClass();
        const teamMates = user.getTeammates();
        const nKnight = teamMates.filter(c => c instanceof UnitClass).length + 1;
        const newUnit = new UnitClass(`Knight ${nKnight}`, user.controlledBy);

        if (!user.battleManager) return "No battle manager found.";

        newUnit.battleManager = user.battleManager;

        // 1. ตรวจสอบทีมของผู้ใช้ และกำหนดทีมให้ตัวละครใหม่
        const isTeamA = user.battleManager.playerTeam.TeamMate.includes(user);
        if (isTeamA) {
            newUnit.teamColor = user.teamColor; // ให้สีทีมเหมือนคนเรียกเพื่อรับ Passive ทีม
            user.battleManager.playerTeam.TeamMate.push(newUnit);
        } else {
            newUnit.teamColor = user.teamColor;
            user.battleManager.enemyTeam.TeamMate.push(newUnit);
        }

        // 2. เพิ่มเข้าคิวการเดิน
        user.battleManager.turnOrder.push(newUnit);

        return `${user.name} uses ${this.name}! [${newUnit.name}] has joined the ${newUnit.teamColor} team.`;
    }
}


export class ActivationSkill extends ActiveSkill {
    public specialBuff: Buff;

    constructor(name: string, description: string, cooldown: number, specialBuff: Buff) {
        super(name, description, cooldown, 'self');
        this.specialBuff = specialBuff;
    }

    execute(user: Character, _target: Character): string {
        const currBuffs: string[] = [];
        user.buffs.forEach(b => currBuffs.push(b.name));

        if (!currBuffs.includes(this.specialBuff.name)) {
            user.buffs.push(this.specialBuff);
            return `${user.name} (${user.role}) on ${this.specialBuff.name}.`;
        } else {
            user.buffs = user.buffs.filter(b => b.name !== this.specialBuff.name);
            return `${user.name} (${user.role}) deactive ${this.specialBuff.name}.`;

        }

    }
}