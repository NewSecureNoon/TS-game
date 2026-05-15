import type { Character } from "../classes/Character";

export interface IStatusEffect {
    name: string;
    duration: number;
    type: 'Buff' | 'Debuff';
    affectedStat: 'atk' | 'def' | 'speed' | null;
    multiplier: number; // เช่น 0.2 สำหรับเพิ่ม 20%, -0.1 สำหรับลด 10%

    onTurnStart(target: Character): void;
}