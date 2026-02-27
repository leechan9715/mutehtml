const swiper1 = new Swiper(".lsc-swiper-1", {
  slidesPerView: 3.8,
  spaceBetween: 15,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

const titleEl = document.getElementById("albumTitle");
const artistEl = document.getElementById("albumArtist");

function updateAlbumText(swiper) {
  const activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide) return;
  titleEl.textContent = activeSlide.dataset.title || "";
  artistEl.textContent = activeSlide.dataset.artist || "";
}

/*
  ✅ Swiper 커버플로우(3D 카드형) 슬라이드 예제
  inspiration: https://dribbble.com/shots/4684682-Aquatic-Animals

  - effect: "coverflow"  → 3D 커버플로우 효과(가운데 강조, 양옆 뒤로 들어감)
  - centeredSlides: true → 활성 슬라이드가 항상 가운데
  - loop: true           → 무한 반복
  - pagination           → 아래 점(dot) 네비게이션
  - keyboard/mousewheel  → 키보드/마우스휠로 넘김
  - breakpoints          → 화면 너비별로 한 화면에 보이는 개수 변경
*/

var swiper = new Swiper(".albumSwiper", {
  /* =========================
    1) 기본 효과/조작감
  ========================= */
  slidesPerView: 3,
  effect: "coverflow", // ✅ 3D 커버플로우 효과 적용
  grabCursor: true, // ✅ 마우스 올리면 'grab' 커서(드래그 가능 느낌)
  centeredSlides: true, // ✅ 활성(active) 슬라이드를 항상 가운데로 정렬

  /* =========================
    2) coverflow 효과 디테일 설정
    - rotate/stretch/depth/modifier 값으로 "입체감" 조절
  ========================= */
  coverflowEffect: {
    rotate: 0, // 좌우 슬라이드 회전각(0이면 회전 거의 없이 카드형 느낌)
    stretch: 0, // 슬라이드 간 "벌어짐" 정도(값↑ = 더 퍼짐)
    depth: 100, // Z축(앞/뒤) 깊이(값↑ = 옆 슬라이드가 더 뒤로 들어가 입체감↑)
    modifier: 3, // 위 효과 전체 강도 배수(값↑ = coverflow 효과가 더 강해짐)
    slideShadows: true, // 슬라이드에 그림자 생성(입체감↑, 깔끔한 디자인이면 false 추천)
  },

  /* =========================
    3) 입력 장치 컨트롤
  ========================= */
  keyboard: {
    enabled: true, // ✅ 키보드 방향키(← →)로 슬라이드 이동 가능
  },

  mousewheel: {
    thresholdDelta: 70, // ✅ 휠 스크롤이 너무 민감하지 않게
    //    휠 변화량(delta)이 70 이상일 때만 슬라이드 이동
  },

  /* =========================
    4) 반복/네비게이션 UI
  ========================= */
  loop: true, // ✅ 마지막→다음으로 넘기면 처음처럼 이어짐(무한 루프)

  pagination: {
    el: ".swiper-pagination", // 점(dot) UI가 들어갈 요소
    clickable: true, // 점 클릭으로 해당 슬라이드로 이동 가능
  },

  /* =========================
    5) 반응형 설정 (breakpoints)
    - Swiper는 "min-width" 기준으로 적용됨
    - 화면 너비가 커질수록 slidesPerView를 늘리는 게 일반적이지만
      이 예제는 768 구간에서 1개로 줄여 '중앙 강조'를 강하게 한 구성
  ========================= */
  //   breakpoints: {
  //     640: {
  //       slidesPerView: 2, // 640px 이상이면 한 화면에 2개 보이게
  //     },
  //     768: {
  //       slidesPerView: 1, // 768px 이상이면 한 화면에 1개(중앙 강조)
  //     },
  //     1024: {
  //       slidesPerView: 2, // 1024px 이상이면 2개
  //     },
  //     1560: {
  //       slidesPerView: 3, // 1560px 이상이면 3개
  //     },
  //   },
});
