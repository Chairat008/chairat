/* ========================================================
 * File     : monster.js
 * Project  : Monster AR
 * Purpose  : โหลดฐานข้อมูลมอนสเตอร์จาก data/monsters.json
 *            และสุ่มมอนสเตอร์ตาม rarity ให้ระบบ spawn ใช้งาน
 * ======================================================== */

import { rollRarity } from './config.js';

let monsterCatalog = null;

/**
 * ฟังก์ชัน: โหลดฐานข้อมูลมอนสเตอร์ (โหลดครั้งเดียว แคชไว้ใน memory)
 * @returns {Promise<Array>}
 */
export async function loadMonsterCatalog() {
  if (monsterCatalog) return monsterCatalog;

  const response = await fetch('data/monsters.json');
  const data = await response.json();
  monsterCatalog = data.monsters;
  return monsterCatalog;
}

/**
 * ฟังก์ชัน: สุ่มมอนสเตอร์ 1 ตัว โดยสุ่ม rarity ก่อน แล้วสุ่มตัวในกลุ่มนั้น
 * ถ้า rarity นั้นไม่มีมอนสเตอร์ จะลดขั้นลงไปหา rarity ที่ต่ำกว่าแทน
 */
export function pickRandomMonster(catalog) {
  const rarityOrder = ['legendary', 'epic', 'rare', 'common'];
  let targetRarity = rollRarity();

  let candidates = catalog.filter((monster) => monster.rarity === targetRarity);

  // กันกรณี rarity ที่สุ่มได้ไม่มีมอนสเตอร์ในฐานข้อมูล ให้ไล่หา rarity ถัดไป
  while (candidates.length === 0) {
    const currentIndex = rarityOrder.indexOf(targetRarity);
    targetRarity = rarityOrder[currentIndex + 1] ?? 'common';
    candidates = catalog.filter((monster) => monster.rarity === targetRarity);
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return { ...candidates[randomIndex] };
}
