/* ========================================================
 * File     : app.js
 * Project  : Monster AR
 * Purpose  : Entry point — เชื่อมระบบ hand tracking ทั้งหมด
 *            (mediapipe, handTracker, gestureManager, uiManager)
 *            เริ่มทำงานหลังกล้องพร้อมใช้งานแล้วเท่านั้น
 * ======================================================== */

import { startHandTracking } from './handTracker.js';
import { initHandTrackingUI, updateHandTrackingUI } from './uiManager.js';
import { processGestureFrame } from './gestureActions.js';

/**
 * ฟังก์ชัน: เริ่มระบบ hand tracking ทั้งหมด
 * เรียกเมื่อ camera.js แจ้งว่ากล้องพร้อมแล้ว (event: camera:ready)
 */
async function initApp(video) {
  initHandTrackingUI();

  try {
    await startHandTracking(video, (result) => {
      updateHandTrackingUI(result);
      processGestureFrame(result);
    });
  } catch (error) {
    console.error('[App] เริ่มระบบ hand tracking ไม่สำเร็จ:', error);
  }
}

// รอสัญญาณจาก camera.js ว่ากล้องพร้อมแล้ว
document.addEventListener('camera:ready', (event) => {
  initApp(event.detail.video);
});
