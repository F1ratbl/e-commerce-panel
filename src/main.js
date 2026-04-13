import "./style.css";
import { initGuidoraPlayground } from "./guidora-playground.js";

// ===== Toast Notification System =====
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };
  const colors = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  toast.className = `toast flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${colors[type]} min-w-[280px]`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-lg">${icons[type]}</span>
    <span class="text-sm font-medium flex-1">${message}</span>
    <button class="material-symbols-outlined text-sm opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(() => this.parentElement.remove(), 250);">close</button>
  `;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 250);
    }
  }, 4000);
}

// ===== Live Pricing Calculator =====
function initPricingCalculator() {
  const basePrice = document.getElementById("base-price");
  const salePrice = document.getElementById("sale-price");
  const costDisplay = document.getElementById("cost-of-goods");
  const feeDisplay = document.getElementById("platform-fee");
  const profitDisplay = document.getElementById("net-profit");

  function recalculate() {
    const price = parseFloat(salePrice?.value || basePrice?.value) || 0;
    const cost = 850.0; // Fixed cost for demo
    const fee = price * 0.15;
    const profit = price - cost - fee;

    if (costDisplay) costDisplay.textContent = `$${cost.toFixed(2)}`;
    if (feeDisplay) feeDisplay.textContent = `-$${fee.toFixed(2)}`;
    if (profitDisplay) {
      profitDisplay.textContent = `$${profit.toFixed(2)}`;
      profitDisplay.classList.toggle("text-error", profit < 0);
      profitDisplay.classList.toggle("text-on-tertiary-container", profit >= 0);
    }
  }

  basePrice?.addEventListener("input", recalculate);
  salePrice?.addEventListener("input", recalculate);
}

// ===== Toggle Switch =====
function initToggle() {
  const toggle = document.getElementById("toggle-low-stock");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isActive = toggle.dataset.active === "true";
    toggle.dataset.active = (!isActive).toString();

    if (!isActive) {
      showToast("Low stock alerts enabled", "warning");
    } else {
      showToast("Low stock alerts disabled", "info");
    }
  });
}

// ===== Color Swatch Picker =====
function initColorPicker() {
  const swatches = document.querySelectorAll(".color-swatch");

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      swatches.forEach((s) => {
        s.classList.remove("ring-2", "ring-primary", "ring-offset-2", "active");
      });
      swatch.classList.add("ring-2", "ring-primary", "ring-offset-2", "active");
    });
  });
}

// ===== Drop Zone =====
function initDropZone() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;

  ["dragenter", "dragover"].forEach((event) => {
    dropZone.addEventListener(event, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((event) => {
    dropZone.addEventListener(event, (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const files = e.dataTransfer?.files;
    if (files?.length) {
      showToast(`${files.length} image(s) ready to upload`, "success");
    }
  });

  dropZone.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.multiple = true;
    input.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files?.length) {
        showToast(`${files.length} image(s) selected`, "success");
      }
    });
    input.click();
  });
}

// ===== SEO Preview Live Update =====
function initSeoPreview() {
  const titleInput = document.getElementById("product-title");
  const slugInput = document.getElementById("url-slug");
  const seoTitle = document.getElementById("seo-title-preview");
  const seoUrl = document.getElementById("seo-url-preview");

  titleInput?.addEventListener("input", () => {
    const title =
      titleInput.value || "Ultra-Thin 15.6-inch Professional Laptop";
    if (seoTitle) seoTitle.textContent = `${title} | TechCorp`;

    // Auto-generate slug
    const slug = titleInput.value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    if (slugInput && slug) slugInput.value = slug;
    if (seoUrl && slug) {
      seoUrl.textContent = `precisionretail.com > laptops > ${slug}`;
    }
  });

  slugInput?.addEventListener("input", () => {
    if (seoUrl) {
      seoUrl.textContent = `precisionretail.com > laptops > ${slugInput.value}`;
    }
  });
}

// ===== Sidebar Navigation =====
function initSidebar() {
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      // Allow real page navigation (non-hash links)
      if (href && href !== "#") return;

      e.preventDefault();
      sidebarLinks.forEach((l) => {
        l.classList.remove(
          "bg-slate-200",
          "dark:bg-slate-800",
          "text-slate-900",
          "dark:text-white",
          "active",
        );
        l.classList.add("text-slate-500", "dark:text-slate-400");
        const icon = l.querySelector(".material-symbols-outlined");
        if (icon) icon.style.fontVariationSettings = "'FILL' 0";
      });

      link.classList.add(
        "bg-slate-200",
        "dark:bg-slate-800",
        "text-slate-900",
        "dark:text-white",
        "active",
      );
      link.classList.remove("text-slate-500", "dark:text-slate-400");
      const icon = link.querySelector(".material-symbols-outlined");
      if (icon) icon.style.fontVariationSettings = "'FILL' 1";
    });
  });
}

// ===== Action Buttons =====
function initActionButtons() {
  // Publish
  document.getElementById("btn-publish")?.addEventListener("click", () => {
    showToast("Product published successfully!", "success");
  });

  // Discard
  document.getElementById("btn-discard")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to discard this draft?")) {
      document
        .querySelectorAll('input[type="text"], input[type="number"], textarea')
        .forEach((input) => {
          if (input.defaultValue) {
            input.value = input.defaultValue;
          } else {
            input.value = "";
          }
        });
      showToast("Draft discarded", "info");
    }
  });

  // FAB Save
  document.getElementById("fab-save")?.addEventListener("click", () => {
    showToast("Draft saved successfully!", "success");
  });

  // New Product sidebar button
  document.getElementById("btn-new-product")?.addEventListener("click", () => {
    showToast("Creating new product...", "info");
  });
}

// ===== Editor Toolbar =====
function initEditorToolbar() {
  const buttons = document.querySelectorAll(".editor-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });
}

// ===== Keyboard Shortcuts =====
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      showToast("Draft saved successfully!", "success");
    }
    // Ctrl/Cmd + Enter to publish
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      showToast("Product published successfully!", "success");
    }
  });
}

// ===== Scroll Progress on Header =====
function initScrollProgress() {
  const header = document.getElementById("top-navbar");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("shadow-md");
      header.classList.remove("shadow-sm");
    } else {
      header.classList.remove("shadow-md");
      header.classList.add("shadow-sm");
    }
  });
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");
  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target) &&
      sidebar.classList.contains("open")
    ) {
      sidebar.classList.remove("open");
    }
  });
}

// ===== Initialize Everything =====
document.addEventListener("DOMContentLoaded", () => {
  initPricingCalculator();
  initToggle();
  initColorPicker();
  initDropZone();
  initSeoPreview();
  initSidebar();
  initMobileMenu();
  initActionButtons();
  initEditorToolbar();
  initKeyboardShortcuts();
  initScrollProgress();
  void initGuidoraPlayground();
});
