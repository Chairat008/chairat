/* ========================================================
 * File     : hudSync.js
 * Project  : Monster AR
 * Purpose  : ซิงค์ข้อมูลจาก save.js (เงิน, EXP, มอนสเตอร์)
 *            ไปแสดงผลในทุกหน้า (Lobby, Shop, Profile, Monster Box)
 *            ทำงานทุกครั้งที่มีการบันทึกข้อมูลใหม่ (save:updated)
 * ======================================================== */

import { loadPlayerState } from './save.js';

const EXP_PER_LEVEL = 100; // ค่า EXP ต่อเลเวล (ใช้คำนวณ % แถบ EXP)

/**
 * ฟังก์ชัน: อัปเดต UI ทั้งหมดที่ผูกกับข้อมูลผู้เล่น
 * @param {object} data - ข้อมูลจาก save.js (money, exp, level, monsterBox)
 */
function renderHud(data) {
  // เงิน (มีหลายจุด: lobby, shop, profile)
  document.querySelectorAll('.js-money-display').forEach((el) => {
    el.textContent = data.money.toLocaleString('en-US');
  });

  // EXP bar ใน lobby
  const expFillEl = document.querySelector('.exp-fill');
  if (expFillEl) {
    const expPercent = Math.min(100, (data.exp % EXP_PER_LEVEL));
    expFillEl.style.width = `${expPercent}%`;
  }

  // Profile: level, exp, จำนวนมอนสเตอร์
  const levelEl = document.getElementById('profileLevel');
  if (levelEl) levelEl.textContent = data.level;

  const expEl = document.getElementById('profileExp');
  if (expEl) expEl.textContent = `${data.exp % EXP_PER_LEVEL}%`;

  const monsterCountEl = document.getElementById('profileMonsterCount');
  if (monsterCountEl) monsterCountEl.textContent = data.monsterBox.length;

  renderMonsterBox(data.monsterBox);
}

/**
 * ฟังก์ชัน: แสดงรายการมอนสเตอร์ในกล่อง (หรือข้อความว่างถ้ายังไม่มี)
 */
function renderMonsterBox(monsterBox) {
  const container = document.getElementById('monsterBoxContent');
  if (!container) return;

  if (!monsterBox || monsterBox.length === 0) {
    container.innerHTML = `
      <div class="monster-empty panel">
        <p>ยังไม่มีมอนสเตอร์ในกล่อง</p>
        <p class="monster-empty-hint">ไปที่ PLAY เพื่อจับมอนสเตอร์ตัวแรก</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="monster-grid">
      ${monsterBox
        .map(
          (monster) => `
        <div class="monster-box-item panel">
          <div class="monster-box-icon">📦</div>
          <div class="monster-box-name">${monster.name}</div>
          <div class="monster-box-rarity">${monster.rarity}</div>
        </div>`
        )
        .join('')}
    </div>`;
}

// โหลดครั้งแรกตอนเปิดหน้า
document.addEventListener('DOMContentLoaded', () => {
  renderHud(loadPlayerState());
});

// อัปเดตทุกครั้งที่ save.js บันทึกข้อมูลใหม่
document.addEventListener('save:updated', (event) => {
  renderHud(event.detail);
});
