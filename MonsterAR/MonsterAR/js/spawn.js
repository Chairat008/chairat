/* ========================================================
 * File     : spawn.js
 * Project  : Monster AR
 * Purpose  : สุ่มมอนสเตอร์ 3 ตัวให้ผู้เล่นเลือก ตอนกด Play
 * ======================================================== */

import { loadMonsterCatalog, pickRandomMonster } from './monster.js';

/**
 * ฟังก์ชัน: สุ่มมอนสเตอร์ 3 ตัว สำหรับหน้าจอเลือกเป้าหมาย
 * @returns {Promise<Array>} มอนสเตอร์ 3 ตัว พร้อม currentHp เริ่มต้น = maxHp
 */
export async function spawnEncounter() {
  const catalog = await loadMonsterCatalog();

  const candidates = [1, 2, 3].map(() => {
    const monster = pickRandomMonster(catalog);
    return { ...monster, currentHp: monster.maxHp };
  });

  return candidates;
}
