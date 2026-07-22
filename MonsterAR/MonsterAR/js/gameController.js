/* ========================================================
 * File     : gameController.js
 * Project  : Monster AR
 * Purpose  : ศูนย์กลางควบคุมเกมเพลย์ทั้งหมด
 *            เชื่อม spawn.js, target.js, battleUI.js, capture.js
 *            เข้าด้วยกัน และรับ action event จาก gestureActions.js
 * ======================================================== */

import { spawnEncounter } from './spawn.js';
import { renderCandidates, updateHighlightByPosition, getHighlightedIndex } from './target.js';
import { renderBattleScreen, updateHpBar, setBattleMessage, showBattleResult, hideBattleResult } from './battleUI.js';
import { attemptCapture } from './capture.js';
import { calcDamage, PLAYER_MONSTER, CAPTURE_REWARD } from './config.js';
import { saveCapturedMonster, addMoney, addExp } from './save.js';

// ---- State ของเกมเพลย์ปัจจุบัน ----
let phase = 'idle'; // idle | select | battle-active | result
let candidates = [];
let wildMonster = null;
let playerHp = PLAYER_MONSTER.maxHp;

/**
 * ฟังก์ชัน: เริ่มการเผชิญหน้า (เรียกตอนกด Play)
 */
async function startEncounter() {
  phase = 'select';
  window.navigateTo('view-game');

  const selectContainer = document.getElementById('encounterSelect');
  const battleContainer = document.getElementById('encounterBattle');
  battleContainer.classList.add('is-hidden');
  selectContainer.classList.remove('is-hidden');

  candidates = await spawnEncounter();
  renderCandidates(candidates, selectContainer);
}

/**
 * ฟังก์ชัน: ยืนยันเลือกมอนสเตอร์ที่ไฮไลต์อยู่ -> เข้าสู้
 */
function confirmSelection() {
  const index = getHighlightedIndex();
  wildMonster = { ...candidates[index] };
  playerHp = PLAYER_MONSTER.maxHp;
  phase = 'battle-active';

  const selectContainer = document.getElementById('encounterSelect');
  const battleContainer = document.getElementById('encounterBattle');
  selectContainer.classList.add('is-hidden');
  battleContainer.classList.remove('is-hidden');

  renderBattleScreen(wildMonster, battleContainer);
}

/**
 * ฟังก์ชัน: โจมตีมอนสเตอร์ป่า (ท่าชูสองนิ้ว)
 */
function playerAttack() {
  const damage = calcDamage(PLAYER_MONSTER.atk, wildMonster.def);
  wildMonster.currentHp = Math.max(0, wildMonster.currentHp - damage);
  updateHpBar('wild', wildMonster.currentHp, wildMonster.maxHp);
  setBattleMessage(`โจมตีโดน ${damage} ดาเมจ!`);

  if (wildMonster.currentHp <= 0) {
    endBattle(`${wildMonster.name} หมดแรงและหนีไปแล้ว...`);
    return;
  }

  setTimeout(wildCounterAttack, 900);
}

/**
 * ฟังก์ชัน: ขว้างบอลจับมอนสเตอร์ (ท่ากำมือระหว่างต่อสู้)
 */
function throwBall() {
  const { success, chance } = attemptCapture(wildMonster.currentHp, wildMonster.maxHp, wildMonster.rarity);
  setBattleMessage(`ขว้างบอล... โอกาสจับ ${Math.round(chance * 100)}%`);

  setTimeout(() => {
    if (success) {
      grantReward(wildMonster.rarity);
      endBattle(`จับ ${wildMonster.name} สำเร็จ!`);
    } else {
      setBattleMessage('บอลหลุด!');
      setTimeout(wildCounterAttack, 700);
    }
  }, 900);
}

/**
 * ฟังก์ชัน: มอนสเตอร์ป่าโจมตีกลับ
 */
function wildCounterAttack() {
  const damage = calcDamage(wildMonster.atk, PLAYER_MONSTER.def);
  playerHp = Math.max(0, playerHp - damage);
  updateHpBar('player', playerHp, PLAYER_MONSTER.maxHp);
  setBattleMessage(`${wildMonster.name} โจมตีกลับ ${damage} ดาเมจ!`);

  if (playerHp <= 0) {
    endBattle(`${PLAYER_MONSTER.name} หมดแรง! ต้องล่าถอย...`);
  }
}

/**
 * ฟังก์ชัน: วิ่งหนีออกจากการต่อสู้ (ท่ายกมือสองข้าง)
 */
function flee() {
  endBattle('วิ่งหนีออกจากการต่อสู้แล้ว');
}

/**
 * ฟังก์ชัน: จบการต่อสู้ แสดงผลลัพธ์ รอท่าทางใด ๆ เพื่อกลับ Lobby
 */
function endBattle(message) {
  phase = 'result';
  showBattleResult(message);

  const onAnyGesture = () => {
    document.removeEventListener('gesture:victory', onAnyGesture);
    document.removeEventListener('gesture:fist', onAnyGesture);
    document.removeEventListener('gesture:surrender', onAnyGesture);
    hideBattleResult();
    window.navigateTo('view-lobby');
    phase = 'idle';
  };

  document.addEventListener('gesture:victory', onAnyGesture);
  document.addEventListener('gesture:fist', onAnyGesture);
  document.addEventListener('gesture:surrender', onAnyGesture);
}

/**
 * ฟังก์ชัน: มอบรางวัลเงิน/EXP/มอนสเตอร์ตอนจับสำเร็จ
 * บันทึกผ่าน save.js เพื่อให้ข้อมูลถาวร และ hudSync.js
 * จะอัปเดตหน้าจอทุกจุดเองโดยอัตโนมัติผ่าน event 'save:updated'
 */
function grantReward(rarity) {
  const reward = CAPTURE_REWARD[rarity];
  saveCapturedMonster(wildMonster);
  addMoney(reward.money);
  addExp(reward.exp);
}

// ---- ผูก Event ทั้งหมดที่มาจาก gestureActions.js ----
document.addEventListener('play:pressed', startEncounter);

document.addEventListener('gesture:pointing', (event) => {
  if (phase === 'select') updateHighlightByPosition(event.detail.x);
});

document.addEventListener('gesture:fist', () => {
  if (phase === 'idle') {
    const lobbyView = document.getElementById('view-lobby');
    if (lobbyView && !lobbyView.classList.contains('is-hidden')) startEncounter();
  } else if (phase === 'select') {
    confirmSelection();
  } else if (phase === 'battle-active') {
    throwBall();
  }
});

document.addEventListener('gesture:victory', () => {
  if (phase === 'battle-active') playerAttack();
});

document.addEventListener('gesture:surrender', () => {
  if (phase === 'battle-active') flee();
});
