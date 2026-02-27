/* ------------------- 승찬 ------------- */
const time = document.querySelector(".time");

function updateTime() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  time.textContent = `${hour}:${minute}`;
}

updateTime(); // 처음 1번 실행
setInterval(updateTime, 1000); // 1초마다 갱신
const swiper1 = new Swiper(".lsc-swiper-2", {
  slidesPerView: 3.3,
  spaceBetween: 15,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
const swiper2 = new Swiper(".lsc-swiper-1", {
  slidesPerView: 4.5,
  spaceBetween: 15,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* ---------------------- 진성 --------------------- */

/* ------------------- 쇼츠 ----------------------- */
/* ------------------- 버튼 ----------------------- */
document.querySelectorAll(".buttons").forEach((button) => {
  const play = button.children[0];
  const pause = button.children[1];

  button.addEventListener("click", () => {
    if (play.style.display !== "block") {
      play.style.display = "block";
      pause.style.display = "none";
    } else {
      play.style.display = "none";
      pause.style.display = "block";
    }
  });
});

/* -----------------------스와이퍼------------------------- */

/* ---------------------가수 스와이퍼----------------------- */
const swiper3 = new Swiper(".ijs-swiper-1", {
  slidesPerView: 3.5,
  spaceBetween: 15,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* ---------------------쇼츠 스와이퍼------------------------ */
const swiper4 = new Swiper(".ijs-swiper-2", {
  slidesPerView: 3.2,
  spaceBetween: 10,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* --------------- 앨범 슬라이드 ---------------- */

(() => {
  const container = document.querySelector("#ijs.albumSlide .col5");
  if (!container) return;

  const images = Array.from(container.querySelectorAll("img"));

  const basePositions = [
    { left: 0, zIndex: 100 },
    { left: 93.25, zIndex: 90 },
    { left: 186.5, zIndex: 80 },
    { left: 279.75, zIndex: 70 },
    { left: 373, zIndex: 60 },
  ];

  const MOVE_THRESHOLD = 90;
  const OFF_RIGHT = 635;
  const OFF_LEFT = -220;
  const PULL_STRENGTH = 0.35;

  const TRANSITION = "left 1s cubic-bezier(0.22, 1, 0.36, 1)";

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let dx = 0;
  let dragDir = 1;
  let tempIndex = 0;

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updatePositions(
    index = currentIndex,
    progress = 0,
    dir = 1,
    animate = true,
  ) {
    const N = basePositions.length;
    const t = clamp01(progress);

    images.forEach((img, i) => {
      const posIndex = (i - index + images.length) % images.length;

      img.style.transition = animate ? TRANSITION : "none";

      if (posIndex >= N) {
        img.style.left = (dir === 1 ? OFF_RIGHT : OFF_LEFT) + "px";
        img.style.zIndex = "10";
        return;
      }

      const cur = basePositions[posIndex];
      const neighborIndex = dir === 1 ? posIndex - 1 : posIndex + 1;

      if (neighborIndex < 0 || neighborIndex >= N) {
        img.style.left = cur.left + "px";
        img.style.zIndex = cur.zIndex;
        return;
      }

      const next = basePositions[neighborIndex];
      const tForThis = posIndex === 0 ? 0 : t * PULL_STRENGTH;
      const left = lerp(cur.left, next.left, tForThis);

      img.style.left = left + "px";
      img.style.zIndex = cur.zIndex;
    });
  }

  function applyStepsFromDx(dxValue) {
    dragDir = dxValue < 0 ? 1 : -1;
    const absDx = Math.abs(dxValue);
    const steps = Math.floor(absDx / MOVE_THRESHOLD);
    const progress = (absDx % MOVE_THRESHOLD) / MOVE_THRESHOLD;
    return { steps, progress };
  }

  function computeTempIndex(baseIndex, steps, dir) {
    const delta = dir === 1 ? steps : -steps;
    return (baseIndex + delta + images.length) % images.length;
  }

  // ✅ 초기 스타일 (cursor 제거)
  container.style.position = "relative";
  container.style.height = "200px";
  container.style.userSelect = "none";

  images.forEach((img) => {
    img.style.position = "absolute";
    img.style.top = "0px";
    img.style.left = "0px";
    img.style.width = "180px";
    img.style.height = "180px";
    img.style.borderRadius = "20px";
    img.style.userSelect = "none";
    img.style.transformOrigin = "center center";
    img.draggable = false;
    img.style.pointerEvents = "none";
  });

  updatePositions(currentIndex, 0, 1, false);
  requestAnimationFrame(() => updatePositions(currentIndex, 0, 1, true));

  // ===== Mouse Only =====
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
    dx = 0;
    tempIndex = currentIndex;
    updatePositions(tempIndex, 0, 1, false);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    dx = e.pageX - startX;
    const { steps, progress } = applyStepsFromDx(dx);
    tempIndex = computeTempIndex(currentIndex, steps, dragDir);

    updatePositions(tempIndex, progress, dragDir, false);
  });

  function finalizeDrag() {
    currentIndex = tempIndex;
    updatePositions(currentIndex, 0, dragDir, true);

    startX = 0;
    dx = 0;
    isDragging = false;
  }

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    finalizeDrag();
  });

  container.addEventListener("mouseleave", () => {
    if (!isDragging) return;
    finalizeDrag();
  });

  // ===== Touch =====
  let touchStartX = 0;
  let touchDx = 0;
  let isTouching = false;

  container.addEventListener("touchstart", (e) => {
    isTouching = true;
    touchStartX = e.touches[0].pageX;
    touchDx = 0;
    tempIndex = currentIndex;
    updatePositions(tempIndex, 0, 1, false);
  });

  container.addEventListener(
    "touchmove",
    (e) => {
      if (!isTouching) return;

      touchDx = e.touches[0].pageX - touchStartX;
      const { steps, progress } = applyStepsFromDx(touchDx);
      tempIndex = computeTempIndex(currentIndex, steps, dragDir);

      updatePositions(tempIndex, progress, dragDir, false);
      e.preventDefault();
    },
    { passive: false },
  );

  container.addEventListener("touchend", () => {
    if (!isTouching) return;
    dx = touchDx;
    finalizeDrag();
    isTouching = false;
    touchStartX = 0;
    touchDx = 0;
  });
})();

///
/// 현주 메인 전용 js
///
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll('input[name="tab"]');
  const charts = document.querySelectorAll(".chart");

  function showChart(id) {
    charts.forEach((chart) => {
      chart.style.display = "none";
    });

    document.querySelector("." + id + "-chart").style.display = "flex";
  }

  // 기본값 (처음 로딩 시)
  const checked = document.querySelector('input[name="tab"]:checked');
  if (checked) {
    showChart(checked.id);
  }

  // 클릭 이벤트
  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
      showChart(this.id);
    });
  });
});
///
/// 현주 메인 전용 js
///
