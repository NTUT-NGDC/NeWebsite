/* =====================================================
   NGDC 北科遊戲研究社 — 專案展示頁篩選功能
   僅供 projects.html 使用。

   運作方式：
   - 每張卡片用 data-type="平台 動作 射擊"（以空白分隔，可複選）
     與 data-status="ongoing"（進行中）或 "done"（已完成）標記分類。
   - 「遊戲類型」可複選；「開發狀態」為單選。
   - 兩組篩選條件為「且」的關係（同時符合才顯示）。
   ===================================================== */

(function () {
  "use strict";

  var typeButtons = document.querySelectorAll("[data-filter-type]");
  var statusButtons = document.querySelectorAll("[data-filter-status]");
  var cards = document.querySelectorAll(".project-card");
  var noResults = document.getElementById("noResults");

  if (!cards.length) return;

  var activeTypes = new Set(); // 空集合代表「全部」
  var activeStatus = "all";

  function applyFilters() {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardTypes = (card.dataset.type || "").split(/\s+/).filter(Boolean);
      var cardStatus = card.dataset.status || "";

      var matchesType =
        activeTypes.size === 0 ||
        cardTypes.some(function (t) {
          return activeTypes.has(t);
        });

      var matchesStatus = activeStatus === "all" || cardStatus === activeStatus;

      var visible = matchesType && matchesStatus;
      card.classList.toggle("is-hidden", !visible);
      if (visible) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle("is-visible", visibleCount === 0);
    }
  }

  typeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.dataset.filterType;

      if (value === "all") {
        activeTypes.clear();
        typeButtons.forEach(function (b) {
          b.classList.toggle("is-active", b.dataset.filterType === "all");
        });
      } else {
        btn.classList.toggle("is-active");

        if (btn.classList.contains("is-active")) {
          activeTypes.add(value);
        } else {
          activeTypes.delete(value);
        }

        var allBtn = document.querySelector('[data-filter-type="all"]');
        if (allBtn) {
          allBtn.classList.toggle("is-active", activeTypes.size === 0);
        }
      }

      applyFilters();
    });
  });

  statusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeStatus = btn.dataset.filterStatus;
      statusButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      applyFilters();
    });
  });
})();

/* =====================================================
   拼格圖片燈箱
   - 點 .project-thumb--gallery 裡的圖片，在頁面上浮動顯示大圖
   - ← → 或按鈕切換同一張卡片的其他圖片，Esc 或點背景關閉
   - 不支援 <dialog> 的瀏覽器維持原本的連結行為（開新分頁）
   ===================================================== */
(function () {
  "use strict";

  var galleries = document.querySelectorAll(".project-thumb--gallery");
  if (!galleries.length || typeof HTMLDialogElement !== "function") return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML =
    '<img class="lightbox-img" alt="" />' +
    '<div class="lightbox-bar">' +
    '<button type="button" class="lightbox-btn" data-step="-1" aria-label="上一張">◀</button>' +
    '<span class="lightbox-caption"></span>' +
    '<button type="button" class="lightbox-btn" data-step="1" aria-label="下一張">▶</button>' +
    '<button type="button" class="lightbox-btn" data-close aria-label="關閉">✕</button>' +
    "</div>";
  document.body.appendChild(dialog);

  var img = dialog.querySelector(".lightbox-img");
  var caption = dialog.querySelector(".lightbox-caption");
  var links = [];
  var index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    var thumb = links[index].querySelector("img");
    img.src = links[index].href;
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = img.alt + "（" + (index + 1) + " / " + links.length + "）";
  }

  galleries.forEach(function (gallery) {
    var galleryLinks = Array.prototype.slice.call(gallery.querySelectorAll("a"));
    galleryLinks.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        links = galleryLinks;
        show(i);
        dialog.showModal();
      });
    });
  });

  dialog.addEventListener("click", function (e) {
    var step = e.target.closest("[data-step]");
    if (step) {
      show(index + Number(step.dataset.step));
    } else if (e.target.closest("[data-close]") || e.target === dialog) {
      // e.target === dialog 代表點到圖片外的背景
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
