import { Character } from '../classes/Character';

export class BattleManager {
    public teamA: Character[];
    public teamB: Character[];
    private turnOrder: Character[] = [];

    constructor(teamA: Character[], teamB: Character[]) {
        // 2. กำหนดค่าด้วยตัวเองภายใน constructor
        this.teamA = teamA;
        this.teamB = teamB;

        // Logic การจัดการลำดับเทิร์น
        this.turnOrder = [...teamA, ...teamB].sort((a, b) => b.speed - a.speed);
    }

    nextTurn(): string {
        const activeChar = this.turnOrder.shift();
        if (activeChar && activeChar.isAlive) {
            // Logic การเลือกเป้าหมายแบบสุ่ม (ตัวอย่างง่ายๆ)
            const target = this.teamB[0];
            const log = activeChar.attack(target);
            this.turnOrder.push(activeChar); // วนกลับไปท้ายแถว
            return log;
        }
        return "Turn skipped.";
    }
}