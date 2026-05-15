import type { IHealable } from "../interfaces/Character.interface";
import { Buff, Debuff, Stunned } from "./Effect";
import { TeamPassive, ActiveSkill, PassiveSkill, ConditionalPassive } from "./Skill";
import type { BattleManager } from "../systems/BattleManager";
import { getRandomInt } from "../systems/HelperFunction";

export abstract class Character implements IHealable {
    public name: string;
    public role: string;
    public maxHp: number;
    public hp: number;
    public baseAtk: number;
    public baseDef: number;
    public baseSpeed: number;
    public skills: ActiveSkill[] = [];
    public buffs: Buff[] = [];
    public debuffs: Debuff[] = [];
    public passives: PassiveSkill[] = [];
    public teamColor: 'Red' | 'Blue' | 'Green';
    public battleManager?: BattleManager;
    public controlledBy: string | null

    constructor(
        name: string,
        role: string,
        maxHp: number,
        atk: number,
        def: number,
        speed: number,
        teamColor: 'Red' | 'Blue' | 'Green',
        controlledBy: string | null
    ) {
        this.name = name;
        this.role = role;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.baseAtk = atk;
        this.baseDef = def;
        this.baseSpeed = speed;
        this.teamColor = teamColor;
        this.controlledBy = controlledBy;
    }

    get atk(): number {
        let multiplierBonus = 0;

        // 1. ดึงโบนัสจาก Passive ส่วนตัวของตัวเอง (เช่น ScalingPassive, ConditionalPassive)
        this.passives.forEach(p => {
            if (p.statModifier === "atk") {
                multiplierBonus += p.getCurrentBonus(this);
            }
        });

        // 2. ดึงโบนัสจาก TeamPassive ของทุกคนในทีม (รวมตัวเองด้วย)
        // หมายเหตุ: ใช้ getTeammates() ที่กรองเฉพาะคนที่ยังมีชีวิตอยู่
        const aliveTeammates = this.getTeammates().filter(m => m.hp > 0);
        const teamPassive: string[] = []
        aliveTeammates.forEach(member => {
            member.passives.forEach(p => {
                // สำคัญ: ต้องเช็คว่า p เป็นอินสแตนซ์ของ TeamPassive หรือไม่
                // และเช็คว่า statModifier ตรงกับ "atk" หรือเปล่า
                if (p instanceof TeamPassive && p.statModifier === "atk") {
                    console.log(`Team passive: ${p.name} from ${member.name} (${member.role}) to ${this.name} (${this.role}) add ${p.multiplier} multiplier.`);
                    teamPassive.push(p.name);
                    multiplierBonus += p.getCurrentBonus(member);
                }
            });
        });

        // คืนค่าพลังโจมตีสุทธิ (Base * (1 + รวมโบนัส))
        return Math.floor(this.baseAtk * (1 + multiplierBonus));
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


    // เช็คว่าติด Stun หรือไม่
    get isStunned(): boolean {
        return this.debuffs.some(d => d.name === "Stunned" && d.duration > 0);
    }


    get isAlive(): boolean {
        if (this.hp <= 0) {
            return false;
        } else {
            return true;
        }
    }


    public showDetail(): void {
        const currBuff: string[] = [];
        const currDebuff: string[] = [];
        const currPassive: string[] = [];
        const currSkill: string[] = [];
        this.buffs.forEach(buff => currBuff.push(buff.name));
        this.debuffs.forEach(debuff => currDebuff.push(debuff.name));
        this.passives.forEach(passive => currPassive.push(passive.name));
        this.skills.forEach(skill => currSkill.push(skill.name));

        console.log(`===============current stat ${this.name}=========`);
        console.log(`hp: ${this.hp}`);
        console.log(`atk: ${this.atk}`);
        console.log(`def: ${this.def}`);
        console.log(`speed: ${this.speed}`);
        console.log(`buffs: ${currBuff}`);
        console.log(`debuffs: ${currDebuff}`);
        console.log(`passives: ${currPassive}`);
        console.log(`skills: ${currSkill}`);
    }


    public getTeammates(): Character[] {
        return this.battleManager ? this.battleManager.getTeammates(this) : [this];
    }


    public getOpponents(): Character[] {
        if (!this.battleManager) return [];
        // เช็คว่าตัวเองอยู่ทีม A หรือ B แล้วคืนค่าทีมตรงข้าม
        return this.battleManager.playerTeam.TeamMate.includes(this)
            ? this.battleManager.enemyTeam.TeamMate
            : this.battleManager.playerTeam.TeamMate;
    }

    public makeAction(target: Character): string {
        const actionList: (() => string)[] = [
            () => this.attack(target)
        ];

        this.skills.forEach(skill => {
            // เช็คว่าคูลดาวน์พร้อมใช้งานหรือไม่
            if (skill.currentCooldown === 0) {
                actionList.push(() => {
                    // 1. ตั้งค่าคูลดาวน์กลับไปที่ค่าสูงสุดทันทีที่ใช้
                    skill.currentCooldown = skill.cooldown;

                    // 2. รันคำสั่งสกิล
                    console.log(`${this.name} uses skill: ${skill.name}`);
                    return skill.execute(this, target);
                });
            }
        });

        // ตรวจสอบว่ามี Action หรือไม่ (กันพลาด)
        if (actionList.length === 0) return `${this.name} (${this.role}) does nothing.`;

        // ใช้ getRandomInt(0, actionList.length - 1) ตามที่คุณแก้มา ถูกต้องแล้วครับ
        const randomIndex = getRandomInt(0, actionList.length - 1);
        const selectedAction = actionList[randomIndex];

        return selectedAction();
    }

    public attack(target: Character): string {
        // การโจมตีปกติในเทิร์น ไม่ใช่การสวนกลับ -> ส่ง false
        const damage = this.atk;
        const blockingBuff = this.buffs.find(b => b.name === "Blocking");
        if (blockingBuff) {
            const successAttackChance = Math.random();
            if (successAttackChance > 0.4) {
                return target.takeDamage(damage, this, false);
            } else {
                return `${this.name} (${this.role}) miss attack with ${successAttackChance}. ${target.name} (${target.role}) doesn't take.`
            }
        } else {
            console.log(`${this.name} (${this.role}) attack ${target.name} (${target.role}) with ${damage} damages.`);
            return target.takeDamage(damage, this, false);
        }
    }


    public takeDamage(amount: number, attacker: Character, isCounter: boolean = false): string {
        const currPassive: string[] = [];
        this.passives.forEach(passive => currPassive.push(passive.name));
        const blockingBuff = this.buffs.find(b => b.name === "Blocking");
        var finalDamage = 0;
        if (blockingBuff) {
            const blockingProb = Math.random();
            if (blockingProb > 0.65) {
                return `${this.name} (${this.role}) block incoming attack with ${blockingProb} from ${attacker.name} (${attacker.role}) successful. No damage taken.`;
            } else {
                finalDamage = Math.max(0, amount - this.def);
            }
        } else {
            finalDamage = Math.max(0, amount - this.def);
        }

        this.hp = Math.max(0, this.hp - finalDamage);

        let log = `${this.name} takes ${finalDamage} damage!`;

        // 1. เช็คความตายก่อน (Death Check)
        if (this.hp <= 0) {
            log += `\n💀 ${this.name} has fallen!`;

            // กรองหา Passive "Self Destruction"
            const deathPassive = this.passives.filter(p => (p.name === "Self Destruction" ||
                p.name === "The Comrade")
            ) as ConditionalPassive[];
            deathPassive.forEach(p => {
                if (p.isConditionMet(this)) {
                    if (p.name === "Self Destruction") {
                        log += `\n💥 ${this.name} (${this.role}) self destruction!`;
                        log += this.executeExplosion();
                    }
                    else if (p.name === 'The Comrade') {
                        const teamMates = this.getTeammates();
                        teamMates.forEach(c => {
                            // เช็คชื่อสกิลด้วย String แทนการเทียบตัวแปร
                            const hasPunishment = c.passives.some(pass => pass.name === "The Punishment");

                            if (c.role === "Berserker" && !hasPunishment) {
                                // สร้าง Instance ใหม่ขึ้นมาตรงนี้เลย (Inline New)
                                const newPunishment = new ConditionalPassive(
                                    "The Punishment",
                                    "สวนกลับทุกครั้งเมื่อโดนโจมตี",
                                    'atk',
                                    0,
                                    (owner) => true
                                );
                                c.passives.push(newPunishment);
                            }
                        });
                    }
                }
            })
        } else {
            // 2. ถ้ายังไม่ตาย ถึงจะเช็คการสวนกลับ (Counter Check)
            if (!isCounter) {
                const counterLog = this.checkCounter(attacker);
                if (counterLog) {
                    log += `\n${counterLog}`;
                }
            }

            const stunPassive = attacker.passives.find(p => p.name === "Shield Bash") as ConditionalPassive;
            const stunDebuffs = new Stunned(1)
            if (stunPassive) {
                const stunProb = Math.random();
                console.log(`Stun Prob: ${stunProb}.`);
                if (stunProb > 0.75) {
                    console.log(`${this.name} (${this.role}) is stunned.`)
                    this.debuffs.push(stunDebuffs);
                }
            }
        }



        return log;
    }


    public receiveHeal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }


    public checkCounter(attacker: Character): string | null {
        // Cannot counter while stunned
        if (this.isStunned) {
            return null;
        }

        const punishmentPassive = this.passives.find(p => p.name === "The Punishment") as ConditionalPassive;

        if (punishmentPassive && punishmentPassive.isConditionMet(this)) {
            const counterDamage = Math.floor(this.atk);

            // สำคัญมาก: ส่งค่า true เข้าไปที่ Parameter ตัวสุดท้าย
            const damageLog = attacker.takeDamage(counterDamage, this, true);

            return `⚡ COUNTER! ${this.name} (${this.role}) strikes back with ${counterDamage} damages: ${damageLog}`;
        }

        return null;
    }

    public executeExplosion(): string {
        const enemies = this.getOpponents();
        let explosionLog = "";

        // ดาเมจระเบิด (เช่น 500 fixed damage หรือคำนวณจาก ATK)
        const damage = 275;

        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                // สำคัญ: ส่ง true เป็น isCounter เพื่อป้องกันการสวนกลับซ้อน
                const result = enemy.takeDamage(damage, this, true);
                explosionLog += `\n    -> ${result}`;
            }
        });

        return explosionLog;
    }


    // ฟังก์ชันสำหรับเคลียร์ Status ที่หมดเวลาแล้ว
    public updateStatusEffects() {
        this.buffs.forEach(b => b.onTurnStart(this));
        this.debuffs.forEach(d => d.onTurnStart(this));
        this.buffs = this.buffs.filter(b => b.duration > 0);
        this.debuffs = this.debuffs.filter(d => d.duration > 0);
    }


    public updateCooldowns(): void {
        this.skills.forEach(skill => {
            if (skill.currentCooldown > 0) {
                skill.currentCooldown--;
            }
            console.log(`${skill.name}'s cooldown: ${skill.currentCooldown}/${skill.cooldown} `)
        });
    }


}