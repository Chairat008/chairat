/* ========================================================
 * File     : router.js
 * Project  : Monster AR
 * Purpose  : สลับการแสดงผลระหว่างหน้าต่าง ๆ (Lobby, Shop,
 *            Profile, Monster Box, Settings) แบบ SPA
 *            เพื่อไม่ให้กล้องต้องเปิดใหม่ทุกครั้งที่เปลี่ยนหน้า
 * ======================================================== */

// ค่าคงที่: ชื่อ class ที่ใช้ซ่อน view
const HIDDEN_CLASS = 'is-hidden';

/**
 * ฟังก์ชัน: สลับไปแสดง view ตาม id ที่ระบุ
 * ซ่อน view อื่นทั้งหมด แสดงเฉพาะ view เป้าหมาย
 */
function navigateTo(viewId) {
  const allViews = document.querySelectorAll('.view');

  allViews.forEach((view) => {
    if (view.id === viewId) {
      view.classList.remove(HIDDEN_CLASS);
    } else {
      view.classList.add(HIDDEN_CLASS);
    }
  });
}

/**
 * ฟังก์ชัน: ผูก event ให้ปุ่มทุกตัวที่มี data-navigate
 * ทำงานแบบ event delegation เพื่อให้ปุ่มที่เพิ่มทีหลังใช้ได้ด้วย
 */
function bindRouterLinks() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-navigate]');
    if (!target) return;

    const destination = target.getAttribute('data-navigate');
    navigateTo(destination);
  });
}

document.addEventListener('DOMContentLoaded', bindRouterLinks);
