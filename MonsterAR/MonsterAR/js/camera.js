/* ========================================================
 * File     : camera.js
 * Project  : Monster AR
 * Purpose  : ขอสิทธิ์การใช้กล้อง, เปิดสตรีมวิดีโอ,
 *            และแสดงผลกล้องเป็นพื้นหลังของทุกหน้า
 *            (Lobby, Shop, Profile, Monster Box, ...)
 * ======================================================== */

// ค่าคงที่: element ที่ใช้วางวิดีโอกล้อง
const CAMERA_LAYER_SELECTOR = '.camera-layer';
const CAMERA_STATUS_SELECTOR = '.camera-status';

// ตัวแปรเก็บ stream ปัจจุบัน (ใช้ตอนต้องปิดกล้องจริง ๆ เท่านั้น)
let currentStream = null;

/**
 * ฟังก์ชัน: ขอสิทธิ์กล้องและเริ่มสตรีมวิดีโอ
 * ใช้กล้องหน้า (facingMode: user) เพราะผู้เล่นต้องยกมือ
 * ให้กล้องเห็นระหว่างเล่น ไม่ใช่ถ่ายโลกภายนอก
 */
async function initCamera() {
  const cameraLayer = document.querySelector(CAMERA_LAYER_SELECTOR);
  const statusPanel = document.querySelector(CAMERA_STATUS_SELECTOR);

  if (!cameraLayer) {
    console.error('[Camera] ไม่พบ .camera-layer ในหน้านี้');
    return;
  }

  showCameraStatus(statusPanel, 'loading');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showCameraStatus(statusPanel, 'unsupported');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    currentStream = stream;
    const videoElement = attachStreamToLayer(cameraLayer, stream);
    showCameraStatus(statusPanel, 'hidden');
    document.dispatchEvent(new CustomEvent('camera:ready', { detail: { video: videoElement } }));
  } catch (error) {
    console.error('[Camera] เปิดกล้องไม่สำเร็จ:', error.name);

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      showCameraStatus(statusPanel, 'denied');
    } else if (error.name === 'NotFoundError') {
      showCameraStatus(statusPanel, 'no-device');
    } else {
      showCameraStatus(statusPanel, 'error');
    }
  }
}

/**
 * ฟังก์ชัน: แทรก <video> ที่เล่น stream กล้องเข้าไปใน layer
 */
function attachStreamToLayer(cameraLayer, stream) {
  let videoElement = cameraLayer.querySelector('.camera-video');

  if (!videoElement) {
    videoElement = document.createElement('video');
    videoElement.className = 'camera-video';
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;
    cameraLayer.appendChild(videoElement);
  }

  videoElement.srcObject = stream;
  return videoElement;
}

/**
 * ฟังก์ชัน: แสดงข้อความสถานะกล้อง (loading / denied / error / hidden)
 */
function showCameraStatus(statusPanel, state) {
  if (!statusPanel) return;

  const messages = {
    loading: { icon: '📷', text: 'กำลังขอสิทธิ์ใช้กล้อง...', showRetry: false },
    denied: { icon: '🚫', text: 'ไม่ได้รับสิทธิ์ใช้กล้อง กรุณาอนุญาตกล้องในเบราว์เซอร์แล้วลองใหม่', showRetry: true },
    unsupported: { icon: '⚠️', text: 'เบราว์เซอร์นี้ไม่รองรับการเข้าถึงกล้อง', showRetry: false },
    'no-device': { icon: '⚠️', text: 'ไม่พบกล้องบนอุปกรณ์นี้', showRetry: true },
    error: { icon: '⚠️', text: 'เกิดข้อผิดพลาดในการเปิดกล้อง กรุณาลองใหม่', showRetry: true },
    hidden: null,
  };

  if (state === 'hidden') {
    statusPanel.classList.add('is-hidden');
    return;
  }

  const info = messages[state];
  statusPanel.classList.remove('is-hidden');
  statusPanel.innerHTML = `
    <div class="camera-status-icon">${info.icon}</div>
    <div class="camera-status-text">${info.text}</div>
    ${info.showRetry ? '<button class="camera-retry-btn" id="cameraRetryBtn">ลองอีกครั้ง</button>' : ''}
  `;

  if (info.showRetry) {
    const retryButton = document.getElementById('cameraRetryBtn');
    retryButton.addEventListener('click', initCamera);
  }
}

// เริ่มขอสิทธิ์กล้องทันทีที่ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', initCamera);
