export abstract class Character {
    public name: string;
    protected maxHp: number;
    protected hp: number;
    protected atk: number;
    protected def: number;
    public speed: number;
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
        this.atk = atk;
        this.def = def;
        this.speed = speed;
        this.teamColor = teamColor;
    }

    abstract attack(target: Character): string;

    takeDamage(amount: number): string {
        const damageDealt = Math.max(1, amount - this.def);
        this.hp -= damageDealt;
        return `${this.name} received ${damageDealt} damage! (Remaining HP: ${this.hp})`;
    }

    get isAlive(): boolean {
        return this.hp > 0;
    }
}