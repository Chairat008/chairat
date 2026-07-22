/* ========================================================
 * File     : gestureManager.js
 * Project  : Monster AR
 * Purpose  : แปลผลท่าทางดิบจาก MediaPipe (ภาษาอังกฤษ)
 *            ให้เป็นชื่อ/ไอคอนภาษาไทยสำหรับแสดงบน UI
 * ======================================================== */

// ตาราง: ชื่อท่าทางจาก MediaPipe -> ข้อมูลแสดงผล
const GESTURE_MAP = {
  Open_Palm: { label: 'แบมือ', icon: '🖐️' },
  Closed_Fist: { label: 'กำมือ', icon: '✊' },
  Pointing_Up: { label: 'ชี้นิ้ว', icon: '☝️' },
  Thumb_Up: { label: 'ยกนิ้วโป้ง', icon: '👍' },
  Thumb_Down: { label: 'คว่ำนิ้วโป้ง', icon: '👎' },
  Victory: { label: 'ชูสองนิ้ว', icon: '✌️' },
  ILoveYou: { label: 'รักเธอ', icon: '🤟' },
  None: { label: 'ไม่ทราบท่าทาง', icon: '❔' },
};

/**
 * ฟังก์ชัน: แปลงชื่อท่าทางดิบเป็นข้อมูลแสดงผลภาษาไทย
 * @param {string|null} gestureName - ชื่อท่าทางจาก MediaPipe
 * @returns {{label: string, icon: string}}
 */
export function describeGesture(gestureName) {
  if (!gestureName || !GESTURE_MAP[gestureName]) {
    return { label: 'ไม่พบมือ', icon: '🚫' };
  }
  return GESTURE_MAP[gestureName];
}

/**
 * ฟังก์ชัน: เช็คว่าท่าทางปัจจุบันคือ "ชี้นิ้ว" หรือไม่
 * (ใช้ตัดสินใจว่าจะแสดงกล่องตรวจจับหรือไม่)
 */
export function isPointingGesture(gestureName) {
  return gestureName === 'Pointing_Up';
}

/**
 * ฟังก์ชัน: เช็คว่าท่าทางปัจจุบันคือ "กำมือ" หรือไม่
 * (ใช้ในระบบ Capture ในอนาคต)
 */
export function isFistGesture(gestureName) {
  return gestureName === 'Closed_Fist';
}
