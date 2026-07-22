/* ========================================================
 * File     : target.js
 * Project  : Monster AR
 * Purpose  : แสดงมอนสเตอร์ 3 ตัวให้เลือก และไฮไลต์ตัวที่
 *            ผู้เล่นกำลังชี้นิ้วอยู่ (แบ่งจอเป็น 3 ส่วน ซ้าย/กลาง/ขวา)
 * ======================================================== */

let containerEl = null;
let highlightedIndex = 1; // เริ่มต้นไฮไลต์ตัวกลางไว้ก่อน

/**
 * ฟังก์ชัน: สร้าง DOM การ์ดมอนสเตอร์ 3 ตัว
 * @param {Array} candidates - มอนสเตอร์ 3 ตัวจาก spawn.js
 * @param {HTMLElement} container - element ที่จะวางการ์ดลงไป
 */
export function renderCandidates(candidates, container) {
  containerEl = container;
  highlightedIndex = 1;

  container.innerHTML = candidates
    .map(
      (monster, index) => `
      <div class="candidate-card ${index === highlightedIndex ? 'is-highlighted' : ''}" data-index="${index}">
        <div class="candidate-body" style="--m-primary: ${monster.colorPrimary}; --m-secondary: ${monster.colorSecondary};"></div>
        <span class="candidate-name">${monster.name}</span>
        <span class="candidate-rarity rarity-${monster.rarity}">${monster.rarity.toUpperCase()}</span>
      </div>`
    )
    .join('');
}

/**
 * ฟังก์ชัน: อัปเดตไฮไลต์ตามตำแหน่ง X ของนิ้วชี้ (แบ่งจอเป็น 3 ส่วนเท่า ๆ กัน)
 * @param {number} x - พิกัด X ของปลายนิ้วชี้ (px)
 */
export function updateHighlightByPosition(x) {
  if (!containerEl) return;

  const third = window.innerWidth / 3;
  const newIndex = x < third ? 0 : x < third * 2 ? 1 : 2;

  if (newIndex === highlightedIndex) return;
  highlightedIndex = newIndex;

  const cards = containerEl.querySelectorAll('.candidate-card');
  cards.forEach((card) => {
    card.classList.toggle('is-highlighted', Number(card.dataset.index) === highlightedIndex);
  });
}

/**
 * ฟังก์ชัน: คืนค่า index ของมอนสเตอร์ที่ถูกไฮไลต์อยู่ตอนนี้
 */
export function getHighlightedIndex() {
  return highlightedIndex;
}
