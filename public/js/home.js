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
document.addEventListener('DOMContentLoaded', (event) => {
    const videos = document.querySelectorAll('#video');

    videos.forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play();
        });

        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Optional: reset the video to the beginning
        });
    });
});


  document.getElementById('get-started').addEventListener('click', function() {
    document.getElementById('page-3').scrollIntoView({ behavior: 'smooth' });
});

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = './images';
const outputFolder = './optimized-images';

fs.readdirSync(inputFolder).forEach(file => {
  sharp(path.join(inputFolder, file))
    .resize(800) // resize to width of 800px
    .toFormat('webp') // convert to WebP format
    .toFile(path.join(outputFolder, file.replace(/\.[^/.]+$/, ".webp")));
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
