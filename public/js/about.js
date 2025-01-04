var swiper = new Swiper(".mySwiper", {
    // spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  const hamburger = document.getElementById('hamburger');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popup-overlay');

hamburger.addEventListener('click', () => {
  popup.classList.add('show');
  popupOverlay.classList.add('show');
});

popupOverlay.addEventListener('click', () => {
  popup.classList.remove('show');
  popupOverlay.classList.remove('show');
});