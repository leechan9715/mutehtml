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

/* -----------------------스와이퍼------------------------ */

/* ---------------------가수 스와이퍼-------------------------- */
const swiper1 = new Swiper(".ijs-swiper-1", {
  slidesPerView: 4.5,
  spaceBetween: 30,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* -----------------------쇼츠 스와이퍼-------------------------- */
const swiper2 = new Swiper(".ijs-swiper-2", {
  slidesPerView: 3.2,
  spaceBetween: 10,
  centeredSlides: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
