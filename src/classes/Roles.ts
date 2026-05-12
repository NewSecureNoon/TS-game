import { Character } from './Character';
import type { IHealable, ISupport, ITank } from '../interfaces/Character.interface';

export class Berserker extends Character implements IHealable {
    constructor(name: string) {
        super(name, 500, 100, 10, 15, 'Red');
    }

    attack(target: Character): string {
        return `${this.name} attack at ${target.name} for ${this.atk} damage!`;
    }

    receiveHeal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    takeDamage(amount: number): string {
        this.hp = Math.min(0, this.hp - amount);
        return `${this.name} take ${amount} damage!`;
    }

}


export class Guardian extends Character implements IHealable, ITank {
    public isTaunting: boolean;

    constructor(name: string) {
        super(name, 350, 75, 200, 15, "Blue");
        this.isTaunting = false;
    }

    attack(target: Character): string {
        return `${this.name} attack at ${target.name} for ${this.atk} damage!`;
    }

    receiveHeal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    toggleTaunt(): void {
        this.isTaunting = !this.isTaunting;
        console.log(`${this.name} is now ${this.isTaunting ? 'TAUNTING' : 'READY'}`);
    }
}

export class Golem extends Character implements ITank, IHealable {
    public isTaunting: boolean;

    constructor(name: string) {
        super(name, 400, 80, 125, 15, 'Green')
        this.isTaunting = false;
    }

    attack(target: Character): string {
        return `${this.name} attack at ${target.name} for ${this.atk} damage!`;
    }

    receiveHeal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    toggleTaunt(): void {
        this.isTaunting = !this.isTaunting;
        console.log(`${this.name} is now ${this.isTaunting ? 'TAUNTING' : 'READY'}`);
    }
}
