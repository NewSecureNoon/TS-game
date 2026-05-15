import { Block } from "./Effect";
import { Knight } from "./Roles";
import { ScalingPassive, ConditionalPassive, TeamPassive, CallReinforcementsSkill, ActivationSkill } from "./Skill";


export const createPunishment = () => new ConditionalPassive(
    "The Punishment",
    "สวนกลับทุกครั้งเมื่อโดนโจมตี",
    'atk',
    0,
    (owner) => true
);


export const BerserkFury = new ScalingPassive(
    "Berserk's Fury",
    "เพิ่ม Atk ตามเลือดที่เสียไป (สูงสุด 80%)",
    'atk',
    0.80,
    (owner) => 1 - (owner.hp / owner.maxHp)
);


export const SelfDestruction = new ConditionalPassive(
    "Self Destruction",
    "ระเบิดตัวเองเมื่อตาย",
    "atk",
    0,
    (owner) => owner.hp <= 0
);


export const TheComrade = new ConditionalPassive(
    "The Comrade",
    "ให้บัฟพิเศษสำหรับแต่ละ role เมื่อตาย",
    null,
    0,
    (owner) => owner.hp <= 0
)

export const WarSpirit = new TeamPassive(
    "War Spirit",
    "บัฟ Atk ทั้งทีม 25%",
    "atk",
    0.25
);


export const ShieldBash = new ConditionalPassive(
    "Shield Bash",
    "มีโอกาส 20% ที่จะตีแล้วติด stun",
    null,
    0,
    (owner) => true
)


export const CallReinforcements = new CallReinforcementsSkill(
    "Call Reinforcement",
    "เรียกหน่วยสนับสนุนแบบสุ่มเข้าสู่สนามรบ",
    3,
    () => {
        // สร้างรายการ Class ที่ต้องการสุ่ม
        const units = [Knight];

        // สุ่มเลือก 1 Class
        const randomIndex = Math.floor(Math.random() * units.length);

        return units[randomIndex]; // คืนค่า Class ที่สุ่มได้ออกไป
    }
);


export const ActivateBlock = new ActivationSkill(
    "Block",
    "ยกโล่ป้องกัน มีโอกาสที่จะโดนโจมตีแล้วไม่ได้รับดาเมจ 35% แต่มีโอกาสที่จะตีปกติจะไม่โดนเป้าหมาย 40%",
    0, 
    new Block()
);