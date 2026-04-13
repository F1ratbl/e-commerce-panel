import './style.css';
import { initGuidoraPlayground } from './guidora-playground.js';

// ===== Toast Notification System =====
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };
  const colors = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  toast.className = `toast flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${colors[type]} min-w-[280px]`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-lg">${icons[type]}</span>
    <span class="text-sm font-medium flex-1">${message}</span>
    <button class="material-symbols-outlined text-sm opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(() => this.parentElement.remove(), 250);">close</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }
  }, 4000);
}

// ===== Order Search Filter =====
function initOrderSearch() {
  const searchInput = document.getElementById('order-search');
  const rows = document.querySelectorAll('tbody tr');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// ===== Status Filter =====
function initStatusFilter() {
  const statusSelect = document.getElementById('status-filter');
  const rows = document.querySelectorAll('tbody tr');

  statusSelect?.addEventListener('change', () => {
    const selected = statusSelect.value;
    rows.forEach((row) => {
      if (selected === 'All Statuses') {
        row.style.display = '';
        return;
      }
      const statusBadge = row.querySelector('td:nth-child(6) span');
      const statusText = statusBadge?.textContent.trim();
      row.style.display = statusText === selected ? '' : 'none';
    });
  });
}

// ===== Action Buttons =====
function initActionButtons() {
  // Export CSV
  document.getElementById('btn-export')?.addEventListener('click', () => {
    showToast('Exporting orders to CSV...', 'info');
  });

  // Create Order
  document.getElementById('btn-create-order')?.addEventListener('click', () => {
    showToast('Order creation modal would open here', 'info');
  });

  // Row action buttons
  document.querySelectorAll('tbody tr').forEach((row) => {
    row.querySelectorAll('button').forEach((btn) => {
      const icon = btn.querySelector('.material-symbols-outlined')?.textContent;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = row.querySelector('td span.font-bold')?.textContent;
        if (icon === 'visibility') {
          showToast(`Viewing details for ${orderId}`, 'info');
        } else if (icon === 'print') {
          showToast(`Printing invoice for ${orderId}`, 'success');
        } else if (icon === 'cancel') {
          if (confirm(`Are you sure you want to cancel ${orderId}?`)) {
            showToast(`${orderId} has been cancelled`, 'warning');
          }
        }
      });
    });

    // Row click to select
    row.addEventListener('click', () => {
      document.querySelectorAll('tbody tr').forEach((r) => r.classList.remove('bg-surface-tint/5'));
      row.classList.add('bg-surface-tint/5');
    });
  });
}

// ===== Pagination =====
function initPagination() {
  const pageButtons = document.querySelectorAll('.flex.items-center.gap-2 button:not([disabled])');
  pageButtons.forEach((btn) => {
    if (btn.querySelector('.material-symbols-outlined')) return; // skip arrow buttons
    btn.addEventListener('click', () => {
      pageButtons.forEach((b) => {
        if (!b.querySelector('.material-symbols-outlined')) {
          b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
          b.classList.add('hover:bg-surface-container', 'text-on-surface-variant');
        }
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('hover:bg-surface-container', 'text-on-surface-variant');
      showToast(`Page ${btn.textContent} loaded`, 'info');
    });
  });
}

// ===== Scroll Progress on Header =====
function initScrollProgress() {
  const header = document.getElementById('top-navbar');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('shadow-md');
      header.classList.remove('shadow-sm');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('shadow-sm');
    }
  });
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  // fallback to class query if id doesn't exist
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
}


// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initOrderSearch();
  initStatusFilter();
  initActionButtons();
  initPagination();
  initScrollProgress();
  initMobileMenu();
  void initGuidoraPlayground();
});
