/* ========================================================
 * File     : save.js
 * Project  : Monster AR
 * Purpose  : บันทึกและโหลดข้อมูลผู้เล่น (เงิน, EXP, มอนสเตอร์)
 *            ด้วย LocalStorage เพื่อให้ข้อมูลอยู่ถาวร
 * ======================================================== */

const STORAGE_KEY = 'monsterAR_saveData';

const DEFAULT_STATE = {
  money: 1250,
  exp: 64,
  level: 12,
  monsterBox: [],
};

/**
 * ฟังก์ชัน: อ่านข้อมูลดิบจาก LocalStorage
 * ถ้ายังไม่เคยมีข้อมูล จะคืนค่าเริ่มต้น
 */
function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_STATE };
  } catch (error) {
    console.error('[Save] โหลดข้อมูลไม่สำเร็จ:', error);
    return { ...DEFAULT_STATE };
  }
}

/**
 * ฟังก์ชัน: เขียนข้อมูลลง LocalStorage
 * และแจ้งเตือนทุกส่วนของเกมผ่าน custom event 'save:updated'
 */
function writeRaw(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent('save:updated', { detail: data }));
  } catch (error) {
    console.error('[Save] บันทึกข้อมูลไม่สำเร็จ:', error);
  }
}

/**
 * ฟังก์ชัน: โหลดข้อมูลผู้เล่นปัจจุบันทั้งหมด
 */
export function loadPlayerState() {
  return loadRaw();
}

/**
 * ฟังก์ชัน: บันทึกมอนสเตอร์ที่จับได้ลงกล่อง
 */
export function saveCapturedMonster(monster) {
  const data = loadRaw();
  data.monsterBox.push({
    name: monster.name,
    rarity: monster.rarity,
    caughtAt: Date.now(),
  });
  writeRaw(data);
}

/**
 * ฟังก์ชัน: เพิ่มเงินให้ผู้เล่น
 */
export function addMoney(amount) {
  const data = loadRaw();
  data.money += amount;
  writeRaw(data);
}

/**
 * ฟังก์ชัน: เพิ่ม EXP ให้ผู้เล่น
 */
export function addExp(amount) {
  const data = loadRaw();
  data.exp += amount;
  writeRaw(data);
}
