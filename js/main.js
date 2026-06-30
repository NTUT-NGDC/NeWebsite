/* =====================================================
   NGDC 北科遊戲研究社 — 共用前端腳本
   功能：手機版選單開關、兩側海浪式像素方塊裝飾
   五個頁面皆共用本檔案，請勿另外複製修改。
   ===================================================== */

(function () {
  "use strict";

  // ---- 手機版導覽選單開關 ----
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // 點擊選單連結後自動收合（手機版）
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- 兩側海浪式像素方塊裝飾 ----
  // 每個 .wave-decoration 容器（包在各 section 內，見 css/style.css）
  // 由上到下鋪滿好幾橫排，每排的方塊數量依正弦波平緩增減，
  // 做出「寬緩起伏、不尖銳」的海浪節奏；顏色固定 4 階，
  // 由外到內依序變亮，跟這排有幾顆方塊無關。
  var WAVE_COLORS = ["#1d3a55", "#2c5a7a", "#3a7fa8", "#3fa9f5"];
  var WAVE_SQUARE = 16; // px，方塊邊長（同一排內方塊間距固定在 css 的 .wave-row gap: 4px）
  var WAVE_ROW_GAP = 8; // px，排與排之間的間距
  var WAVE_BASE_COUNT = 3; // 每排平均幾顆方塊
  var WAVE_AMPLITUDE = 2; // 起伏振幅（每排數量最多增減幾顆）
  var WAVE_PERIOD = 10; // 波長（數字越大，波峰到波谷之間排數越多、越寬緩）

  function buildWaveRowCounts(rowCount) {
    var counts = [];
    for (var i = 0; i < rowCount; i++) {
      var count = Math.round(
        WAVE_BASE_COUNT + WAVE_AMPLITUDE * Math.sin((i / WAVE_PERIOD) * Math.PI * 2)
      );
      counts.push(Math.max(1, count));
    }
    return counts;
  }

  function renderWaveDecoration(container) {
    var style = getComputedStyle(container);
    var paddingTop = parseFloat(style.paddingTop) || 0;
    var paddingBottom = parseFloat(style.paddingBottom) || 0;
    var usableHeight = container.clientHeight - paddingTop - paddingBottom;
    var rowUnit = WAVE_SQUARE + WAVE_ROW_GAP;
    var rowCount = Math.max(1, Math.floor(usableHeight / rowUnit));
    var rowCounts = buildWaveRowCounts(rowCount);
    var fragment = document.createDocumentFragment();

    rowCounts.forEach(function (count) {
      var rowEl = document.createElement("div");
      rowEl.className = "wave-row";
      for (var c = 0; c < count; c++) {
        var square = document.createElement("div");
        square.className = "wave-square";
        square.style.backgroundColor = WAVE_COLORS[Math.min(c, WAVE_COLORS.length - 1)];
        rowEl.appendChild(square);
      }
      fragment.appendChild(rowEl);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
  }

  function initWaveDecorations() {
    document.querySelectorAll(".wave-decoration").forEach(renderWaveDecoration);
  }

  initWaveDecorations();

  // 視窗縮放時重新計算排數（用 debounce 避免拖曳縮放時頻繁重繪）
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initWaveDecorations, 200);
  });
})();
