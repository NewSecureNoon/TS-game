import { Character } from './Character';
import { BerserkFury, SelfDestruction, ShieldBash, TheComrade, WarSpirit, ActivateBlock } from './SkillData';
import { CallReinforcementsSkill } from './Skill';


export class MadnessBerserker extends Character {
    constructor(name: string, controlledBy: string) {
        super(`${name} - ${controlledBy}`, "Berserker", 350, 100, 15, 20, 'Red', controlledBy);
        this.passives.push(BerserkFury);
    }

}


export class WarDrummer extends Character {
    constructor(name: string, controlledBy: string) {
        super(`${name} - ${controlledBy}`, "War Drummer", 150, 75, 15, 5, "Red", controlledBy);
        this.passives.push(TheComrade, WarSpirit, SelfDestruction);
    }

}


export class PaladinLeader extends Character {
    constructor(name: string, controlledBy: string) {
        super(`${name} - ${controlledBy}`, "Palandin Leader", 350, 100, 100, 15, "Blue", controlledBy);
        this.passives.push(ShieldBash);
        this.skills.push(new CallReinforcementsSkill(
            "Call Reinforcement",
            "เรียกหน่วยสนับสนุนแบบสุ่มเข้าสู่สนามรบ",
            3,
            () => {
                // สร้างรายการ Class ที่ต้องการสุ่ม
                const units: Array<new (name: string, controlledBy: string | null) => any> = [
                    Knight as unknown as new (name: string, controlledBy: string | null) => any
                ];

                // สุ่มเลือก 1 Class
                const randomIndex = Math.floor(Math.random() * units.length);

                return units[randomIndex]; // คืนค่า Class ที่สุ่มได้ออกไป
            }
        ));
    }
}


export class Knight extends Character {
    constructor(name: string, controlledBy: string) {
        super(`${name} - ${controlledBy}`, "Knight", 100, 80, 35, 7, "Blue", controlledBy);
        this.skills.push(ActivateBlock);
    }

}

// export class Healer extends Character {
//     constructor(name: string) {
//         super(name, "Healer", 75, 0, 0, 5, "Blue")
//     }
// }


// export class BlueMagicDamage extends Character {
//     constructor(name: string) {
//         super(name, name, 100, 15, 50, 10, "Blue");
//     }
// }

// export class BlueSupport extends Character {
//     constructor(name: string) {
//         super(name, name, 100, 5, 25, 10, "Blue");
//     }
// }


// export class GreenTank extends Character {
//     constructor(name: string) {
//         super(name, name, 400, 80, 125, 15, 'Green')
//     }
// }


// export class GreenPhysicDamage extends Character {
//     constructor(name: string) {
//         super(name, name, 250, 50, 25, 20, "Green");
//     }
// }


// export class GreenMagicDamage extends Character {
//     constructor(name: string) {
//         super(name, name, 250, 35, 25, 17, "Green");
//     }
// }


// export class GreeSupport extends Character {
//     constructor(name: string) {
//         super(name, name, 300, 15, 25, 18, "Green");
//     }
// }