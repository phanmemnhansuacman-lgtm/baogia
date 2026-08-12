// ============================================================
// SCRIPT DÙNG CHUNG CHO TẤT CẢ TRANG BÁO GIÁ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initThemeToggle();
  fillQuoteDates();
  initPrintButton();
});

/* ---- Chuyển tab (Tổng quan / Bảng giá / Tính năng / Điều khoản...) ---- */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        p.classList.toggle('active', p.id === target);
      });

      // Cập nhật URL hash để có thể chia sẻ link tới đúng tab
      history.replaceState(null, '', '#' + target);
    });
  });

  // Mở đúng tab theo hash khi tải trang (vd: bao-gia-tt99.html#bang-gia)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (target) target.click();
  }
}

/* ---- Bật/tắt chế độ sáng - tối, lưu lựa chọn vào bộ nhớ trình duyệt ---- */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('baogia-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcon(toggle);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('baogia-theme', next);
    updateToggleIcon(toggle);
  });
}

function updateToggleIcon(toggle) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  toggle.textContent = isLight ? '☀' : '☾';
}

/* ---- Tự điền ngày phát hành báo giá + ngày hết hạn (mặc định +30 ngày) ---- */
function fillQuoteDates() {
  const issueEl = document.querySelector('[data-quote-issue]');
  const expiryEl = document.querySelector('[data-quote-expiry]');
  if (!issueEl && !expiryEl) return;

  const validDays = parseInt(document.body.dataset.validDays || '30', 10);
  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + validDays);

  const fmt = d => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (issueEl) issueEl.textContent = fmt(today);
  if (expiryEl) expiryEl.textContent = fmt(expiry);
}

/* ---- Nút "In / Lưu PDF" dùng chức năng in sẵn có của trình duyệt ---- */
function initPrintButton() {
  document.querySelectorAll('[data-action="print"]').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });
}
