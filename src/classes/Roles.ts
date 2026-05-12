import { Character } from './Character';
import { BerserkFury, Punishment } from './Skill';


export class TheWrath extends Character {
    constructor(name: string) {
        super(name, 500, 75, 30, 15, 'Red');
        this.passives.push(Punishment)
    }

}

export class Berserker extends Character {
    constructor(name: string) {
        super(name, 300, 75, 30, 15, 'Red');
        this.passives.push(BerserkFury);
    }
    
}

export class RedMagicDamage extends Character {
    constructor(name: string) {
        super(name, 100, 50, 50, 13, "Red");
    }
}


export class WarDrummer extends Character {
    constructor(name: string) {
        super(name, 125, 15, 15, 12, "Red");
    }

}


export class BlueTank extends Character {
    constructor(name: string) {
        super(name, 350, 75, 100, 15, "Blue");
    }
}


export class BluePhysicDamage extends Character {
    constructor(name: string) {
        super(name, 100, 10, 75, 10, "Blue");
    }

}


export class BlueMagicDamage extends Character {
    constructor(name: string) {
        super(name, 100, 15, 50, 10, "Blue");
    }
}

export class BlueSupport extends Character {
    constructor(name: string) {
        super(name, 100, 5, 25, 10, "Blue");
    }
}


export class GreenTank extends Character {
    constructor(name: string) {
        super(name, 400, 80, 125, 15, 'Green')
    }
}


export class GreenPhysicDamage extends Character {
    constructor(name: string) {
        super(name, 250, 50, 25, 20, "Green");
    }
}


export class GreenMagicDamage extends Character {
    constructor(name: string) {
        super(name, 250, 35, 25, 17, "Green");
    }
}


export class GreeSupport extends Character {
    constructor(name: string) {
        super(name, 300, 15, 25, 18, "Green");
    }
}