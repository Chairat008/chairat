/* ========================================================
 * File     : uiManager.js
 * Project  : Monster AR
 * Purpose  : อัปเดต DOM ตามผลลัพธ์การตรวจจับมือ
 *            - กล่องสี่เหลี่ยมพื้นที่ตรวจจับ (ตามตำแหน่งนิ้วชี้)
 *            - Panel แจ้งเตือนท่าทางปัจจุบัน (ฝั่งซ้าย)
 * ======================================================== */

import { describeGesture, isPointingGesture } from './gestureManager.js';

let trackingBoxEl = null;
let gesturePanelEl = null;

/**
 * ฟังก์ชัน: เตรียม element ของกล่องตรวจจับและ panel ท่าทาง
 * เรียกครั้งเดียวตอนเริ่มระบบ
 */
export function initHandTrackingUI() {
  const app = document.getElementById('app');

  trackingBoxEl = document.createElement('div');
  trackingBoxEl.className = 'tracking-box is-hidden';
  app.appendChild(trackingBoxEl);

  gesturePanelEl = document.createElement('div');
  gesturePanelEl.className = 'gesture-panel';
  gesturePanelEl.innerHTML = `
    <div class="gesture-panel-icon">🚫</div>
    <div class="gesture-panel-text">ไม่พบมือ</div>
  `;
  app.appendChild(gesturePanelEl);
}

/**
 * ฟังก์ชัน: อัปเดต UI ตามผลลัพธ์ล่าสุดจาก handTracker.js
 * @param {object} result - ผลลัพธ์จาก parseResult() ใน handTracker.js
 */
export function updateHandTrackingUI(result) {
  updateGesturePanel(result);
  updateTrackingBox(result);
}

/**
 * ฟังก์ชัน: อัปเดต panel แจ้งท่าทางฝั่งซ้าย
 */
function updateGesturePanel(result) {
  const info = result.handDetected ? describeGesture(result.gestureName) : describeGesture(null);

  gesturePanelEl.innerHTML = `
    <div class="gesture-panel-icon">${info.icon}</div>
    <div class="gesture-panel-text">${info.label}</div>
    ${result.handDetected ? `<div class="gesture-panel-confidence">${Math.round(result.confidence * 100)}%</div>` : ''}
  `;
}

/**
 * ฟังก์ชัน: อัปเดตตำแหน่งกล่องตรวจจับ
 * แสดงเฉพาะตอนท่าทางเป็น "ชี้นิ้ว" เท่านั้น ตามที่ออกแบบไว้
 * ขนาดกล่อง = ครึ่งหนึ่งของด้านที่สั้นกว่าของจอ (สี่เหลี่ยมจัตุรัส)
 */
function updateTrackingBox(result) {
  const shouldShow = result.handDetected && isPointingGesture(result.gestureName);

  if (!shouldShow) {
    trackingBoxEl.classList.add('is-hidden');
    return;
  }

  const boxSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  const halfBox = boxSize / 2;

  // จำกัดตำแหน่งไม่ให้กล่องล้นออกนอกจอ
  const clampedX = Math.min(Math.max(result.fingerTip.x, halfBox), window.innerWidth - halfBox);
  const clampedY = Math.min(Math.max(result.fingerTip.y, halfBox), window.innerHeight - halfBox);

  trackingBoxEl.style.width = `${boxSize}px`;
  trackingBoxEl.style.height = `${boxSize}px`;
  trackingBoxEl.style.left = `${clampedX - halfBox}px`;
  trackingBoxEl.style.top = `${clampedY - halfBox}px`;
  trackingBoxEl.classList.remove('is-hidden');
}
