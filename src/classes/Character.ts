import type { IHealable } from "../interfaces/Character.interface";
import { Buff, Debuff } from "./Effect";
import type { PassiveSkill, ConditionalPassive } from "./Skill";

export abstract class Character implements IHealable{
    public name: string;
    public maxHp: number;
    public hp: number;
    public baseAtk: number;
    public baseDef: number;
    public baseSpeed: number;
    private buffs: Buff[] = [];
    private debuffs: Debuff[] = [];
    public passives: PassiveSkill[] = [];
    public teamColor: 'Red' | 'Blue' | 'Green';

    constructor(
        name: string,
        maxHp: number,
        atk: number,
        def: number,
        speed: number,
        teamColor: 'Red' | 'Blue' | 'Green'
    ) {
        this.name = name;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.baseAtk = atk;
        this.baseDef = def;
        this.baseSpeed = speed;
        this.teamColor = teamColor;
    }

    get atk(): number {
        const totalMultiplier = this.buffs
        .filter(b => b.affectedStat === 'atk')
        .reduce((sum, b) => sum + b.multiplier, 0) - this.debuffs
        .filter(d => d.affectedStat === 'atk').reduce((sum, d) => sum + d.multiplier, 0);
        
        const passiveMultiplier = this.passives.filter(p => p.statModifier === 'atk').reduce((sum, p) => sum + p.getCurrentBonus(this), 0)
        const finalAtk = this.baseAtk * (1 + totalMultiplier + passiveMultiplier);

        return Math.max(0, Math.floor(finalAtk));
    }
    
    get def(): number {
        const totalMultiplier = this.buffs
        .filter(b => b.affectedStat === 'def')
        .reduce((sum, b) => sum + b.multiplier, 0) - this.debuffs
        .filter(d => d.affectedStat === 'def').reduce((sum, d) => sum + d.multiplier, 0);

        const finalDef = this.baseDef * (1 + totalMultiplier);

        return Math.max(0, Math.floor(finalDef));
    }

    get speed(): number {
        const totalMultiplier = this.buffs
        .filter(b => b.affectedStat === 'speed')
        .reduce((sum, b) => sum + b.multiplier, 0) - this.debuffs
        .filter(d => d.affectedStat === 'speed').reduce((sum, d) => sum + d.multiplier, 0);

        const finalSpeed = this.baseSpeed * (1 + totalMultiplier);

        return Math.max(0, Math.floor(finalSpeed));
    }
    
    public attack(target: Character): string {
        const damage = this.atk;
        // การโจมตีปกติในเทิร์น ไม่ใช่การสวนกลับ -> ส่ง false
        return target.takeDamage(damage, this, false);
    }

    // เพิ่ม Parameter ตัวที่ 3: isCounter
    public takeDamage(amount: number, attacker: Character, isCounter: boolean = false): string {
        const finalDamage = Math.max(0, amount - this.def);
        this.hp = Math.max(0, this.hp - finalDamage);
        
        let log = `${this.name} takes ${finalDamage} damage!`;

        // เงื่อนไขหยุด Loop: ถ้าดาเมจนี้ "ไม่ใช่" การสวนกลับ ถึงจะอนุญาตให้สวนกลับได้
        if (!isCounter) {
            const counterLog = this.checkCounter(attacker);
            if (counterLog) {
                log += `\n${counterLog}`;
            }
        }

        return log;
    }

    public receiveHeal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    public checkCounter(attacker: Character): string | null {
        const punishmentPassive = this.passives.find(p => p.name === "The Punishment") as ConditionalPassive;

        if (punishmentPassive && punishmentPassive.isConditionMet(this)) {
            const counterDamage = Math.floor(this.atk);
            
            // สำคัญมาก: ส่งค่า true เข้าไปที่ Parameter ตัวสุดท้าย
            const damageLog = attacker.takeDamage(counterDamage, this, true); 
            
            return `⚡ COUNTER! ${this.name} strikes back: ${damageLog}`;
        }

        return null;
    }
}