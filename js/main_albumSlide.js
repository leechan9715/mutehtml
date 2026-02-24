/**
 * main_albumSlide.js (FINAL - no snap bounce)
 * - 메인은 교체 느낌 유지
 * - 뒤 카드는 살짝 당겨짐
 * - 마지막에 퉁 튕기는 현상 제거
 * - 마우스 / 터치 / 키보드 지원
 */

(() => {
  const container = document.querySelector("#ijs-album .col5");
  if (!container) return;

  const images = Array.from(container.querySelectorAll("img"));

  const basePositions = [
    { left: 0, opacity: 1, zIndex: 100, scale: 1 },
    { left: 93.25, opacity: 1, zIndex: 90, scale: 1 },
    { left: 186.5, opacity: 1, zIndex: 80, scale: 1 },
    { left: 279.75, opacity: 1, zIndex: 70, scale: 1 },
    { left: 373, opacity: 1, zIndex: 60, scale: 1 },
  ];

  const MOVE_THRESHOLD = 90;
  const OFF_RIGHT = 635;
  const OFF_LEFT = -220;
  const PULL_STRENGTH = 0.35;

  const TRANSITION =
    "transform 2s cubic-bezier(0.22, 1, 0.36, 1), left 1s cubic-bezier(0.22, 1, 0.36, 1)";

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

      img.style.transition = animate ? TRANSITION : "0.25s";

      if (posIndex >= N) {
        img.style.left = (dir === 1 ? OFF_RIGHT : OFF_LEFT) + "px";
        img.style.transform = "scale(0.88)";
        img.style.opacity = "0";
        img.style.zIndex = "10";
        return;
      }

      const cur = basePositions[posIndex];
      const neighborIndex = dir === 1 ? posIndex - 1 : posIndex + 1;
      const next = basePositions[(neighborIndex + N) % N];

      // 메인 슬롯은 고정, 뒤만 살짝 당김
      const tForThis = posIndex === 0 ? 0 : t * PULL_STRENGTH;

      const left = lerp(cur.left, next.left, tForThis);
      const opacity = lerp(cur.opacity, next.opacity, tForThis);
      const scale = lerp(cur.scale ?? 1, next.scale ?? 1, tForThis);

      img.style.left = left + "px";
      img.style.opacity = opacity;
      img.style.transform = `scale(${scale})`;
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

  // 초기 스타일
  container.style.cursor = "grab";
  container.style.position = "relative";
  container.style.height = "240px";
  container.style.userSelect = "none";

  images.forEach((img) => {
    img.style.position = "absolute";
    img.style.top = "0px"; // ✅ 추가: 위아래 튐 방지
    img.style.left = "0px";
    img.style.width = "180px";
    img.style.height = "180px";
    img.style.borderRadius = "20px";
    img.style.cursor = "grab";
    img.style.userSelect = "none";
    img.style.transformOrigin = "center center";
    img.draggable = false;
    img.style.pointerEvents = "none";
  });

  updatePositions(currentIndex, 0, 1, false);
  requestAnimationFrame(() => updatePositions(currentIndex, 0, 1, true));

  // ===== Mouse =====
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
    dx = 0;
    tempIndex = currentIndex;
    container.style.cursor = "grabbing";
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
    const absDx = Math.abs(dx);
    const steps = Math.floor(absDx / MOVE_THRESHOLD);
    const progress = (absDx % MOVE_THRESHOLD) / MOVE_THRESHOLD;

    const finalSteps = steps + (progress > 0.5 ? 1 : 0);
    currentIndex = computeTempIndex(currentIndex, finalSteps, dragDir);

    updatePositions(currentIndex, 0, dragDir, true);

    container.style.cursor = "grab";
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

  // ===== Keyboard =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updatePositions(currentIndex, 0, -1, true);
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      updatePositions(currentIndex, 0, 1, true);
    }
  });
})();
