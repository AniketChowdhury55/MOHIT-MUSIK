const scroll = new LocomotiveScroll({
    el: document.querySelector('.body'),
    smooth: true
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

var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
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

  document.getElementById('get-started').addEventListener('click', function() {
    document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
});

function validateForm() {
  const email = document.getElementById("email").value.trim();
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const message = document.getElementById("message").value.trim();

  // Check if email contains '@'
  if (!email.includes('@')) {
    alert("Please enter a valid email address containing '@'.");
    return false;
  }

  // Check for non-empty and non-blank inputs
  if (name === "" || message === "") {
    alert("Please fill out all fields without leaving blank spaces.");
    return false;
  }

  // Validate mobile number (must be exactly 10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number without any alphabets or special characters.");
    return false;
  }

  return true;
}

