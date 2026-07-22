/* ========================================================
 * File     : config.js
 * Project  : Monster AR
 * Purpose  : ค่าคงที่และสูตรคำนวณหลักของเกมเพลย์
 *            (ดาเมจ, อัตราจับ, เวลาที่ต้องค้างท่าทาง, สัดส่วนสุ่ม rarity)
 * ======================================================== */

// ---- เวลาที่ต้องค้างท่าทางไว้ ก่อนจะนับเป็น Action จริง (กัน trigger รัว) ----
export const GESTURE_HOLD_MS = 500;

// ---- สัดส่วนโอกาสสุ่ม Rarity ตอน spawn (รวมกันต้องได้ 1.0) ----
export const RARITY_WEIGHTS = {
  common: 0.6,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03,
};

// ---- อัตราจับพื้นฐาน (ตอน HP เต็ม) ต่อ rarity ----
export const BASE_CATCH_RATE = {
  common: 0.55,
  rare: 0.35,
  epic: 0.2,
  legendary: 0.08,
};

// ---- สถิติมอนสเตอร์ของผู้เล่น (ชั่วคราว รอระบบทีมจริงในอนาคต) ----
export const PLAYER_MONSTER = {
  name: 'Sparku',
  maxHp: 90,
  atk: 14,
  def: 8,
};

// ---- รางวัลตอนจับสำเร็จ ต่อ rarity ----
export const CAPTURE_REWARD = {
  common: { money: 30, exp: 15 },
  rare: { money: 70, exp: 35 },
  epic: { money: 150, exp: 70 },
  legendary: { money: 400, exp: 150 },
};

/**
 * ฟังก์ชัน: คำนวณดาเมจการโจมตี
 * มี variance สุ่ม 0.85 - 1.15 เท่า ลดด้วยค่าป้องกันเป้าหมาย
 */
export function calcDamage(atk, def) {
  const variance = 0.85 + Math.random() * 0.3;
  const raw = atk * variance - def * 0.4;
  return Math.max(1, Math.round(raw));
}

/**
 * ฟังก์ชัน: คำนวณโอกาสจับสำเร็จ
 * ยิ่ง HP เหลือน้อย โอกาสยิ่งสูงขึ้น (จาก base rate จนถึงเกือบ 90%)
 * @param {number} currentHp
 * @param {number} maxHp
 * @param {string} rarity
 */
export function calcCaptureChance(currentHp, maxHp, rarity) {
  const baseRate = BASE_CATCH_RATE[rarity] ?? 0.3;
  const hpFactor = 1 - currentHp / maxHp; // 0 = HP เต็ม, 1 = HP หมด
  const chance = baseRate + hpFactor * (0.9 - baseRate);
  return Math.min(0.95, Math.max(0.05, chance));
}

/**
 * ฟังก์ชัน: สุ่ม rarity ตามสัดส่วนที่กำหนดใน RARITY_WEIGHTS
 */
export function rollRarity() {
  const roll = Math.random();
  let cumulative = 0;

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulative += weight;
    if (roll <= cumulative) return rarity;
  }

  return 'common'; // fallback กันพลาด
}
