/* ========================================================
 * File     : handTracker.js
 * Project  : Monster AR
 * Purpose  : รัน loop ตรวจจับมือทุกเฟรมจากวิดีโอกล้อง
 *            คำนวณตำแหน่งปลายนิ้วชี้ (landmark 8) เป็นพิกัดจอจริง
 *            แล้วส่งผลลัพธ์ออกไปให้ gestureManager / uiManager ใช้
 * ======================================================== */

import { loadGestureRecognizer } from './mediapipe.js';

// index ของ landmark ปลายนิ้วชี้ ตามมาตรฐาน MediaPipe Hand Landmark
const INDEX_FINGER_TIP = 8;

let recognizer = null;
let videoElement = null;
let isRunning = false;

/**
 * ฟังก์ชัน: เริ่มระบบตรวจจับมือ
 * @param {HTMLVideoElement} video - element วิดีโอจาก camera.js
 * @param {Function} onUpdate - callback รับผลลัพธ์ทุกเฟรม
 */
export async function startHandTracking(video, onUpdate) {
  videoElement = video;
  recognizer = await loadGestureRecognizer();
  isRunning = true;
  requestAnimationFrame((timestamp) => trackLoop(timestamp, onUpdate));
}

/**
 * ฟังก์ชัน: loop หลักที่รันทุกเฟรม เพื่อตรวจจับมือและท่าทาง
 */
function trackLoop(timestamp, onUpdate) {
  if (!isRunning) return;

  if (videoElement.readyState >= 2) {
    const result = recognizer.recognizeForVideo(videoElement, timestamp);
    const parsed = parseResult(result);
    onUpdate(parsed);
  }

  requestAnimationFrame((nextTimestamp) => trackLoop(nextTimestamp, onUpdate));
}

/**
 * ฟังก์ชัน: แปลงผลลัพธ์ดิบจาก MediaPipe ให้อยู่ในรูปแบบที่ใช้งานง่าย
 * รวมถึงคำนวณตำแหน่งปลายนิ้วชี้เป็นพิกัดจอจริง (px)
 * หมายเหตุ: ต้องกลับแกน X เพราะวิดีโอถูก mirror (scaleX(-1)) ใน CSS
 */
function parseResult(result) {
  const numHands = result.landmarks ? result.landmarks.length : 0;

  if (numHands === 0) {
    return {
      handDetected: false,
      gestureName: null,
      confidence: 0,
      fingerTip: null,
      twoHandsOpen: false,
    };
  }

  const landmarks = result.landmarks[0];
  const gestureInfo = result.gestures[0] && result.gestures[0][0];

  const rawTip = landmarks[INDEX_FINGER_TIP];
  const mirroredX = 1 - rawTip.x; // กลับด้านตามภาพ mirror

  const fingerTip = {
    x: mirroredX * window.innerWidth,
    y: rawTip.y * window.innerHeight,
  };

  // ตรวจสอบท่า "ยกมือสองข้างแบมือ" (ใช้เป็นท่ายอมแพ้/วิ่งหนี)
  let twoHandsOpen = false;
  if (numHands === 2) {
    const gestureA = result.gestures[0] && result.gestures[0][0] && result.gestures[0][0].categoryName;
    const gestureB = result.gestures[1] && result.gestures[1][0] && result.gestures[1][0].categoryName;
    twoHandsOpen = gestureA === 'Open_Palm' && gestureB === 'Open_Palm';
  }

  return {
    handDetected: true,
    gestureName: gestureInfo ? gestureInfo.categoryName : 'None',
    confidence: gestureInfo ? gestureInfo.score : 0,
    fingerTip,
    twoHandsOpen,
  };
}

/**
 * ฟังก์ชัน: หยุดระบบตรวจจับมือ
 */
export function stopHandTracking() {
  isRunning = false;
}
