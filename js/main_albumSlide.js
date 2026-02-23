const container = document.querySelector(".col5");
const images = Array.from(container.querySelectorAll("img"));

// 각 이미지의 기본 위치 (CSS와 동일)
const basePositions = [0, 100, 170, 210, 240];
let currentIndex = 0;

// 드래그 중 임시 인덱스
let tempIndex = 0;

// 초기 위치 설정
function updatePositions(instant = false, useIndex = null) {
  const indexToUse = useIndex !== null ? useIndex : currentIndex;

  images.forEach((img, i) => {
    const posIndex = (i - indexToUse + images.length) % images.length;

    if (instant) {
      img.style.transition = "none";
    } else {
      img.style.transition = "all 0.25s ease-out";
    }

    const leftPos = basePositions[posIndex];
    img.style.left = leftPos + "px";
    img.style.zIndex = 105 - posIndex; // 105, 104, 103, 102, 101

    // 모든 이미지 보이게 설정
    img.style.opacity = "1";
    img.style.visibility = "visible";
  });
}

// 드래그 변수
let isDragging = false;
let startX = 0;
let currentX = 0;
let accumulatedDistance = 0; // 누적 드래그 거리
let lastMoveCount = 0; // 마지막으로 이동한 개수

// 한 장 넘기는데 필요한 거리
const MOVE_THRESHOLD = 80;

// 마우스 다운
container.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX;
  currentX = e.pageX;
  accumulatedDistance = 0;
  lastMoveCount = 0;
  tempIndex = currentIndex;

  container.style.cursor = "grabbing";
  e.preventDefault();
});

// 마우스 무브 - 실시간 체크 및 이동
container.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const prevX = currentX;
  currentX = e.pageX;
  const deltaX = currentX - prevX;

  // 누적 거리 계산
  accumulatedDistance += deltaX;

  console.log("누적 거리:", accumulatedDistance);

  // 오른쪽으로 드래그 (이전으로) - 양수
  if (accumulatedDistance > MOVE_THRESHOLD) {
    console.log("← 한 장 이전으로!");

    // 임시 인덱스 업데이트
    tempIndex = (tempIndex - 1 + images.length) % images.length;
    lastMoveCount++;

    // 즉시 위치 변경
    updatePositions(false, tempIndex);

    // 누적 거리 리셋
    accumulatedDistance = 0;
  }
  // 왼쪽으로 드래그 (다음으로) - 음수
  else if (accumulatedDistance < -MOVE_THRESHOLD) {
    console.log("한 장 다음으로 →");

    // 임시 인덱스 업데이트
    tempIndex = (tempIndex + 1) % images.length;
    lastMoveCount++;

    // 즉시 위치 변경
    updatePositions(false, tempIndex);

    // 누적 거리 리셋
    accumulatedDistance = 0;
  }

  e.preventDefault();
});

// 마우스 업 - 최종 인덱스 확정
container.addEventListener("mouseup", (e) => {
  if (!isDragging) return;

  console.log(`총 ${lastMoveCount}개 이동 완료`);

  // 최종 인덱스 확정
  currentIndex = tempIndex;

  // 마지막 정리
  updatePositions(false, currentIndex);

  isDragging = false;
  startX = 0;
  currentX = 0;
  accumulatedDistance = 0;
  lastMoveCount = 0;
  container.style.cursor = "grab";
});

// 마우스가 컨테이너 밖으로 나갔을 때
container.addEventListener("mouseleave", () => {
  if (isDragging) {
    console.log(`총 ${lastMoveCount}개 이동 완료 (밖으로)`);

    // 최종 인덱스 확정
    currentIndex = tempIndex;

    updatePositions(false, currentIndex);

    isDragging = false;
    startX = 0;
    currentX = 0;
    accumulatedDistance = 0;
    lastMoveCount = 0;
    container.style.cursor = "grab";
  }
});

// 터치 이벤트 (모바일)
let touchStartX = 0;
let touchCurrentX = 0;
let touchPrevX = 0;
let isTouching = false;

container.addEventListener("touchstart", (e) => {
  isTouching = true;
  touchStartX = e.touches[0].pageX;
  touchCurrentX = e.touches[0].pageX;
  touchPrevX = e.touches[0].pageX;
  accumulatedDistance = 0;
  lastMoveCount = 0;
  tempIndex = currentIndex;
});

container.addEventListener("touchmove", (e) => {
  if (!isTouching) return;

  touchPrevX = touchCurrentX;
  touchCurrentX = e.touches[0].pageX;
  const deltaX = touchCurrentX - touchPrevX;

  accumulatedDistance += deltaX;

  // 오른쪽으로 스와이프 (이전으로)
  if (accumulatedDistance > MOVE_THRESHOLD) {
    console.log("← 한 장 이전으로! (터치)");

    tempIndex = (tempIndex - 1 + images.length) % images.length;
    lastMoveCount++;
    updatePositions(false, tempIndex);
    accumulatedDistance = 0;
  }
  // 왼쪽으로 스와이프 (다음으로)
  else if (accumulatedDistance < -MOVE_THRESHOLD) {
    console.log("한 장 다음으로 → (터치)");

    tempIndex = (tempIndex + 1) % images.length;
    lastMoveCount++;
    updatePositions(false, tempIndex);
    accumulatedDistance = 0;
  }

  e.preventDefault();
});

container.addEventListener("touchend", () => {
  if (!isTouching) return;

  console.log(`총 ${lastMoveCount}개 이동 완료 (터치)`);

  currentIndex = tempIndex;
  updatePositions(false, currentIndex);

  isTouching = false;
  touchStartX = 0;
  touchCurrentX = 0;
  touchPrevX = 0;
  accumulatedDistance = 0;
  lastMoveCount = 0;
});

// 키보드 방향키 지원
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updatePositions(false, currentIndex);
  } else if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % images.length;
    updatePositions(false, currentIndex);
  }
});

// 초기화
container.style.cursor = "grab";
updatePositions(true);
