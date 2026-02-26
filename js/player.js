// 설정
const totalDuration = 217;
let currentTime = 0;
let isPlaying = false;
let isDragging = false;
let animationFrameId = null;

// DOM 요소
const progressFill = document.querySelector(".progress-fill");
const progressThumb = document.querySelector(".progress-thumb");
const currentTimeDisplay = document.querySelector(".current-time");
const totalTimeDisplay = document.querySelector(".total-time");
const progressBar = document.querySelector(".progress-bar");
const playPauseButton = document.querySelector(".play-pause-button");
const playPauseImg = document.querySelector(".play-pause-img");
const prevButton = document.querySelector(
  'button img[alt="prev-button"]',
).parentElement;
const nextButton = document.querySelector(
  'button img[alt="next-button"]',
).parentElement;

// 색상 추출용
const colorThief = new ColorThief();
const albumImage = document.querySelector(".artist-img img");
const artistImgBox = document.querySelector(".artist-img");

// 시간 형식 변환
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 진행바 업데이트
function updateProgress() {
  const percentage = (currentTime / totalDuration) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  progressFill.style.width = clampedPercentage + "%";
  progressThumb.style.left = clampedPercentage + "%";
  currentTimeDisplay.textContent = formatTime(currentTime);
}

// 자동 재생
let lastTime = Date.now();

function playMusic() {
  if (isPlaying && !isDragging) {
    const now = Date.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    currentTime += delta;

    if (currentTime >= totalDuration) {
      currentTime = totalDuration;
      isPlaying = false;
      playPauseImg.src = "../../assets/images/player/play.png";
      playPauseImg.alt = "play-button";
      cancelAnimationFrame(animationFrameId);
      return;
    }

    updateProgress();
  }

  if (isPlaying) {
    animationFrameId = requestAnimationFrame(playMusic);
  }
}

// 재생/일시정지
playPauseButton.addEventListener("click", () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    playPauseImg.src = "../../assets/images/player/pause.png";
    playPauseImg.alt = "pause-button";
    lastTime = Date.now();
    animationFrameId = requestAnimationFrame(playMusic);
  } else {
    playPauseImg.src = "../../assets/images/player/play.png";
    playPauseImg.alt = "play-button";
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  if (currentTime >= totalDuration) {
    currentTime = 0;
  }
});

// 이전/다음 버튼
prevButton.addEventListener("click", () => {
  currentTime = Math.max(0, currentTime - 5);
  updateProgress();
});

nextButton.addEventListener("click", () => {
  currentTime = Math.min(totalDuration, currentTime + 5);
  updateProgress();
});

// 진행바 클릭/드래그
let rafId = null;

progressBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  progressBar.classList.add("dragging");
  updateTimeFromClick(e);
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateTimeFromClick(e);
    });
  }
});

window.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    progressBar.classList.remove("dragging");
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
});

// 터치 이벤트
progressBar.addEventListener("touchstart", (e) => {
  isDragging = true;
  progressBar.classList.add("dragging");
  updateTimeFromTouch(e);
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (isDragging) {
      e.preventDefault();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateTimeFromTouch(e);
      });
    }
  },
  { passive: false },
);

window.addEventListener("touchend", () => {
  if (isDragging) {
    isDragging = false;
    progressBar.classList.remove("dragging");
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
});

function updateTimeFromClick(e) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, clickX / rect.width));
  currentTime = percentage * totalDuration;
  updateProgress();
}

function updateTimeFromTouch(e) {
  const rect = progressBar.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, touchX / rect.width));
  currentTime = percentage * totalDuration;
  updateProgress();
}

// 중앙 영역에서만 색상 추출
function getColorFromCenter(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  ctx.drawImage(img, 0, 0);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.25;

  const imageData = ctx.getImageData(
    centerX - radius,
    centerY - radius,
    radius * 2,
    radius * 2,
  );

  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const red = imageData.data[i];
    const green = imageData.data[i + 1];
    const blue = imageData.data[i + 2];

    const diff =
      Math.abs(red - green) + Math.abs(green - blue) + Math.abs(blue - red);
    if (diff > 30) {
      r += red;
      g += green;
      b += blue;
      count++;
    }
  }

  if (count === 0) {
    return [220, 180, 120];
  }

  return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
}

// 색상 밝기 조절
function adjustBrightness(r, g, b, factor) {
  return [
    Math.min(255, Math.floor(r * factor)),
    Math.min(255, Math.floor(g * factor)),
    Math.min(255, Math.floor(b * factor)),
  ];
}

// 색상 적용
function applyBackgroundColor() {
  let r, g, b;

  try {
    [r, g, b] = getColorFromCenter(albumImage);

    const [topR, topG, topB] = adjustBrightness(r, g, b, 1.15);
    const [midR, midG, midB] = adjustBrightness(r, g, b, 1.2);
    const [bottomR, bottomG, bottomB] = adjustBrightness(r, g, b, 1.25);

    artistImgBox.style.background = `
      linear-gradient(
        180deg,
        rgba(${topR}, ${topG}, ${topB}, 0.8) 0%,
        rgba(${midR}, ${midG}, ${midB}, 0.75) 50%,
        rgba(${bottomR}, ${bottomG}, ${bottomB}, 0.8) 100%
      )
    `;

    artistImgBox.style.boxShadow = `
      0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
      0 0 100px rgba(${r}, ${g}, ${b}, 0.3)
    `;
  } catch (error) {
    r = 220;
    g = 180;
    b = 120;

    artistImgBox.style.background = `
      linear-gradient(
        180deg,
        rgba(253, 207, 138, 0.8) 0%,
        rgba(264, 216, 144, 0.75) 50%,
        rgba(275, 225, 150, 0.8) 100%
      )
    `;

    artistImgBox.style.boxShadow = `
      0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
      0 0 100px rgba(${r}, ${g}, ${b}, 0.3)
    `;
  }
}

// 이미지 로딩
albumImage.crossOrigin = "Anonymous";

if (albumImage.complete) {
  applyBackgroundColor();
} else {
  albumImage.addEventListener("load", applyBackgroundColor);
}

// 초기 설정
totalTimeDisplay.textContent = formatTime(totalDuration);
updateProgress();
