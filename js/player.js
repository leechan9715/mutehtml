// 설정
const totalDuration = 217;
let currentTime = 0;
let isPlaying = false;
let isDragging = false;

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
const artistImgBox = document.querySelector(".artist-img"); // ✅ 앨범 커버 뒤 박스

// 시간 형식 변환
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 진행바 업데이트
function updateProgress() {
  const percentage = (currentTime / totalDuration) * 100;
  progressFill.style.width = percentage + "%";
  progressThumb.style.left = percentage + "%";
  currentTimeDisplay.textContent = formatTime(currentTime);
}

// 자동 재생
function playMusic() {
  if (isPlaying && !isDragging) {
    currentTime += 0.1;

    if (currentTime >= totalDuration) {
      currentTime = totalDuration;
      isPlaying = false;
      playPauseImg.src = "../../assets/images/player/play.png";
      playPauseImg.alt = "play-button";
    }

    updateProgress();
  }
}

setInterval(playMusic, 100);

// 재생/일시정지
playPauseButton.addEventListener("click", () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    playPauseImg.src = "../../assets/images/player/pause.png";
    playPauseImg.alt = "pause-button";
  } else {
    playPauseImg.src = "../../assets/images/player/play.png";
    playPauseImg.alt = "play-button";
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
progressBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateTimeFromClick(e);
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    updateTimeFromClick(e);
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

progressBar.addEventListener("touchstart", (e) => {
  isDragging = true;
  updateTimeFromTouch(e);
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (isDragging) {
      e.preventDefault();
      updateTimeFromTouch(e);
    }
  },
  { passive: false },
);

window.addEventListener("touchend", () => {
  isDragging = false;
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

// 🎨 이미지에서 색상 추출 (앨범 커버 뒤 박스)
if (albumImage.complete) {
  applyBackgroundColor();
} else {
  albumImage.addEventListener("load", applyBackgroundColor);
}

function applyBackgroundColor() {
  try {
    const dominantColor = colorThief.getColor(albumImage);
    const [r, g, b] = dominantColor;

    // ✅ 앨범 커버 뒤 박스에 배경 적용
    artistImgBox.style.background = `
      linear-gradient(
        135deg,
        rgba(${r}, ${g}, ${b}, 0.9) 0%,
        rgba(${r}, ${g}, ${b}, 0.7) 100%
      )
    `;

    artistImgBox.style.boxShadow = `
      0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
      0 0 100px rgba(${r}, ${g}, ${b}, 0.3)
    `;

    console.log("추출된 색상:", `rgb(${r}, ${g}, ${b})`);
  } catch (error) {
    console.error("색상 추출 실패:", error);
  }
}

// 초기 설정
totalTimeDisplay.textContent = formatTime(totalDuration);
updateProgress();
