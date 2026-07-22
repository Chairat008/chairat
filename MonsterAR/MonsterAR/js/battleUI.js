/* ========================================================
 * File     : battleUI.js
 * Project  : Monster AR
 * Purpose  : สร้างและอัปเดต DOM ของหน้าจอต่อสู้
 *            (HP bar ทั้งสองฝั่ง, ข้อความผลลัพธ์, panel guide ท่าทาง)
 * ======================================================== */

import { PLAYER_MONSTER } from './config.js';

let battleContainerEl = null;

/**
 * ฟังก์ชัน: สร้างโครง DOM ของหน้าจอต่อสู้ทั้งหมด
 * @param {object} wildMonster - มอนสเตอร์ป่าที่จะสู้ด้วย
 * @param {HTMLElement} container
 */
export function renderBattleScreen(wildMonster, container) {
  battleContainerEl = container;

  container.innerHTML = `
    <div class="battle-stage">
      <div class="battle-monster wild-side">
        <div class="wild-body" style="--m-primary: ${wildMonster.colorPrimary}; --m-secondary: ${wildMonster.colorSecondary};"></div>
        <span class="battle-name">${wildMonster.name}</span>
        <div class="hp-bar-wrap">
          <span class="hp-bar-label">HP</span>
          <div class="hp-bar"><div class="hp-fill" id="wildHpFill" style="width: 100%;"></div></div>
        </div>
      </div>

      <div class="battle-monster player-side">
        <div class="monster-body sparku-battle-body">
          <div class="monster-ear left"></div>
          <div class="monster-ear right"></div>
          <div class="monster-antenna"></div>
          <div class="monster-eye left"></div>
          <div class="monster-eye right"></div>
        </div>
        <span class="battle-name">${PLAYER_MONSTER.name}</span>
        <div class="hp-bar-wrap">
          <span class="hp-bar-label">HP</span>
          <div class="hp-bar"><div class="hp-fill" id="playerHpFill" style="width: 100%;"></div></div>
        </div>
      </div>
    </div>

    <p class="battle-message" id="battleMessage">${wildMonster.name} ป่าปรากฏตัว!</p>

    <div class="action-guide panel">
      <span>✌️ โจมตี</span>
      <span>✊ ขว้างบอล</span>
      <span>🖐️🖐️ ยอมแพ้</span>
    </div>

    <div class="battle-result-overlay is-hidden" id="battleResult">
      <p class="result-text" id="resultText"></p>
      <p class="result-hint">ทำท่าใดก็ได้เพื่อไปต่อ</p>
    </div>
  `;
}

/**
 * ฟังก์ชัน: อัปเดต HP bar ของฝั่งที่ระบุ
 * @param {'player'|'wild'} side
 * @param {number} currentHp
 * @param {number} maxHp
 */
export function updateHpBar(side, currentHp, maxHp) {
  const fillEl = document.getElementById(side === 'player' ? 'playerHpFill' : 'wildHpFill');
  if (!fillEl) return;

  const percent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  fillEl.style.width = `${percent}%`;
  fillEl.classList.toggle('hp-low', percent <= 25);
}

/**
 * ฟังก์ชัน: แสดงข้อความสถานะการต่อสู้ (เช่น "โจมตีโดน 12 ดาเมจ!")
 */
export function setBattleMessage(text) {
  const messageEl = document.getElementById('battleMessage');
  if (messageEl) messageEl.textContent = text;
}

/**
 * ฟังก์ชัน: แสดง overlay ผลลัพธ์จบการต่อสู้ (จับสำเร็จ/หนี/แพ้)
 * @param {string} text
 */
export function showBattleResult(text) {
  const overlay = document.getElementById('battleResult');
  const resultText = document.getElementById('resultText');
  if (!overlay || !resultText) return;

  resultText.textContent = text;
  overlay.classList.remove('is-hidden');
}

/**
 * ฟังก์ชัน: ซ่อน overlay ผลลัพธ์
 */
export function hideBattleResult() {
  const overlay = document.getElementById('battleResult');
  if (overlay) overlay.classList.add('is-hidden');
}
