/* =====================================================
   NTUT GDC 北科遊戲研究社 — 專案展示頁篩選功能
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
