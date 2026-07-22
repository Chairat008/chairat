/* ========================================================
 * File     : lobby-demo.js
 * Project  : Monster AR
 * Purpose  : จัดการปุ่ม Play ของหน้า Lobby
 *            ยิง event 'play:pressed' ให้ gameController.js
 *            เริ่มระบบ spawn + select + battle ต่อ
 * ======================================================== */

function bindPlayButton() {
  const playButton = document.getElementById('playBtn');

  playButton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('play:pressed'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindPlayButton();
});
