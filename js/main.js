/* =====================================================
   NTUT GDC 北科遊戲研究社 — 共用前端腳本
   功能：手機版選單開關、隨機像素背景裝飾
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

  // ---- 隨機像素背景裝飾 ----
  // 在 #pixelDecor 容器內，於畫面邊緣／角落區域產生隨機分布的
  // 小方塊（約 14px），顏色在亮藍與暗藍灰之間交錯。
  var decorContainer = document.getElementById("pixelDecor");

  if (decorContainer) {
    var PIXEL_COUNT = 55;
    var COLOR_BRIGHT = [63, 169, 245]; // #3fa9f5
    var COLOR_DIM = [44, 90, 122]; // #2c5a7a

    function lerp(a, b, t) {
      return Math.round(a + (b - a) * t);
    }

    function mixColor(t) {
      var r = lerp(COLOR_DIM[0], COLOR_BRIGHT[0], t);
      var g = lerp(COLOR_DIM[1], COLOR_BRIGHT[1], t);
      var b = lerp(COLOR_DIM[2], COLOR_BRIGHT[2], t);
      return "rgb(" + r + "," + g + "," + b + ")";
    }

    // 讓座標偏向 0% 或 100%（畫面邊緣），使裝飾集中在邊角
    function edgeBiasedValue() {
      var t = Math.pow(Math.random(), 2.2);
      return Math.random() < 0.5 ? t * 16 : 100 - t * 16;
    }

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < PIXEL_COUNT; i++) {
      var pixel = document.createElement("span");
      var size = 10 + Math.random() * 8; // 約 10~18px，平均 14px
      var alongHorizontalEdge = Math.random() < 0.7;

      var left = alongHorizontalEdge ? edgeBiasedValue() : Math.random() * 100;
      var top = alongHorizontalEdge ? Math.random() * 100 : edgeBiasedValue();

      pixel.style.left = left + "%";
      pixel.style.top = top + "%";
      pixel.style.width = size + "px";
      pixel.style.height = size + "px";
      pixel.style.backgroundColor = mixColor(Math.random());
      pixel.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);

      fragment.appendChild(pixel);
    }

    decorContainer.appendChild(fragment);
  }
})();
