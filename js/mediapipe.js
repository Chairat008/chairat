/* ========================================================
 * File     : mediapipe.js
 * Project  : Monster AR
 * Purpose  : โหลดโมเดล MediaPipe Gesture Recognizer
 *            (ตรวจจับมือ + จำแนกท่าทางในตัวเดียว)
 * ======================================================== */

import {
  GestureRecognizer,
  FilesetResolver,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';

// ค่าคงที่: path ของไฟล์ wasm และโมเดล (โหลดจาก CDN ของ Google)
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';

/**
 * ฟังก์ชัน: โหลดและสร้าง instance ของ Gesture Recognizer
 * รองรับ 2 มือ, รันแบบ VIDEO (ต่อเนื่องเฟรมต่อเฟรม)
 * @returns {Promise<GestureRecognizer>}
 */
export async function loadGestureRecognizer() {
  const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

  const recognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_PATH,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 2,
  });

  return recognizer;
}
