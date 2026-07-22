/* ========================================================
 * File     : gestureActions.js
 * Project  : Monster AR
 * Purpose  : แปลงผลตรวจจับท่าทางดิบ (ทุกเฟรม) ให้เป็น
 *            "Action Event" ที่ trigger ครั้งเดียวต่อการทำท่า 1 ครั้ง
 *            (ต้องค้างท่าไว้ตามเวลาที่กำหนกใน config.js ก่อน ถึงจะนับ)
 * ======================================================== */

import { GESTURE_HOLD_MS } from './config.js';

let heldGestureKey = null;
let heldSinceTimestamp = 0;
let consumed = false;

/**
 * ฟังก์ชัน: ประมวลผลผลลัพธ์ 1 เฟรม แล้วยิง custom event เมื่อครบเงื่อนไข
 * - 'gesture:pointing'  ยิงทุกเฟรมที่ชี้นิ้ว (ใช้ไฮไลต์แบบ real-time)
 * - 'gesture:victory'   ยิงครั้งเดียวเมื่อชูสองนิ้วค้างครบเวลา (โจมตี)
 * - 'gesture:fist'      ยิงครั้งเดียวเมื่อกำมือค้างครบเวลา (ยืนยัน/ขว้างบอล)
 * - 'gesture:surrender' ยิงครั้งเดียวเมื่อยกมือสองข้างแบมือค้างครบเวลา (หนี)
 */
export function processGestureFrame(result) {
  const now = performance.now();

  // ---- ท่าทางที่ต้อง trigger แบบ real-time (ไม่ debounce) ----
  if (result.handDetected && result.gestureName === 'Pointing_Up') {
    document.dispatchEvent(new CustomEvent('gesture:pointing', { detail: { x: result.fingerTip.x } }));
  }

  // ---- คำนวณ key ของท่าทางปัจจุบัน (รวมท่า 2 มือ) ----
  let currentKey = null;
  if (result.twoHandsOpen) {
    currentKey = 'surrender';
  } else if (result.handDetected && result.gestureName === 'Victory') {
    currentKey = 'victory';
  } else if (result.handDetected && result.gestureName === 'Closed_Fist') {
    currentKey = 'fist';
  }

  // ---- ท่าเปลี่ยนไป: เริ่มจับเวลาใหม่ ----
  if (currentKey !== heldGestureKey) {
    heldGestureKey = currentKey;
    heldSinceTimestamp = now;
    consumed = false;
    return;
  }

  // ---- ท่าเดิม แต่ยังไม่ครบเวลาที่ต้องค้าง หรือ trigger ไปแล้ว ----
  if (!currentKey || consumed) return;

  const heldDuration = now - heldSinceTimestamp;
  if (heldDuration >= GESTURE_HOLD_MS) {
    consumed = true;
    document.dispatchEvent(new CustomEvent(`gesture:${currentKey}`));
  }
}
