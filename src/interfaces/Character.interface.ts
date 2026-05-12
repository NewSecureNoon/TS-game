import { Character } from "../classes/Character";

export interface IHealable {
  receiveHeal(amount: number): void;
}

export interface ISupport {
  applyBuff(target: any): string; // ส่งกลับเป็นข้อความ Log
}

export interface IReactivePassive {
    onDamaged(owner: Character, attacker: Character): string;
}