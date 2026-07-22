/* ========================================================
 * File     : capture.js
 * Project  : Monster AR
 * Purpose  : คำนวณโอกาสจับมอนสเตอร์ และทอยผลว่าจับสำเร็จหรือไม่
 * ======================================================== */

import { calcCaptureChance } from './config.js';

/**
 * ฟังก์ชัน: ทอยว่าขว้างบอลแล้วจับมอนสเตอร์สำเร็จหรือไม่
 * @param {number} currentHp
 * @param {number} maxHp
 * @param {string} rarity
 * @returns {{ success: boolean, chance: number }}
 */
export function attemptCapture(currentHp, maxHp, rarity) {
  const chance = calcCaptureChance(currentHp, maxHp, rarity);
  const roll = Math.random();
  return { success: roll <= chance, chance };
}
