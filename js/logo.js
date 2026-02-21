const eyes = document.querySelectorAll(".eye");
const mouth = document.querySelector(".mouth");

// 눈 깜빡임
function blink() {
  eyes.forEach((e) => (e.style.transform = "scaleY(0.1)"));
  setTimeout(() => {
    eyes.forEach((e) => (e.style.transform = "scaleY(1)"));
  }, 150);
}
setInterval(blink, 3000);

// 입 애니메이션: 납작해졌다가 웃는 입으로 변신 후 원래대로
function mouthAnimation() {
  // 1. 납작한 직선 입
  mouth.classList.add("flat");
  mouth.classList.remove("smile");
  eyes.forEach((e) => e.classList.remove("smile-eye"));

  // 2. 0.3초 후 웃는 입
  setTimeout(() => {
    mouth.classList.remove("flat");
    mouth.classList.add("smile");
    eyes.forEach((e) => e.classList.add("smile-eye"));
  }, 300);

  // 3. 1.5초 후 기본 입으로 복귀
  setTimeout(() => {
    mouth.classList.remove("smile");
    eyes.forEach((e) => e.classList.remove("smile-eye"));
  }, 1800);
}

setInterval(mouthAnimation, 3000);
