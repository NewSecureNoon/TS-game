import { BattleManager } from './src/systems/BattleManager';
import { Berserker, Guardian } from './src/classes/Roles';

const healer = new Berserker("Groot");
const enemy = new Guardian("Shadow");

const manager = new BattleManager([healer], [enemy]);

// จำลองการต่อสู้ 1 เทิร์น
console.log(manager.nextTurn());