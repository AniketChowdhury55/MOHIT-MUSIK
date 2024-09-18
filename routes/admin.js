const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { ensureAuthenticated } = require('../middlewares/auth');
const Container = require('../models/Container')
const Card = require('../models/Card');;
const Config = require('../models/Config');
const Iframe = require('../models/Iframe');
const session = require('express-session');
const passport = require('passport');
const SwiperSlide = require('../models/SwiperSlide'); // Adjust the path if necessary


const multer = require('multer');
const path = require('path');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));  

// Cloudinary configuration
cloudinary.config({
  cloud_name:  process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECREAT 
});

// Dummy data for containers (replace with a DB later)
let containers = [];
// Session middleware (MUST come before routes)
// Dummy admin user with a plain password
const adminUser = {
  username: process.env.USER_NAME,
  password: process.env.PASS_WORD // Normal password (not hashed)
};


// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }  
});  

const upload = multer({ storage: storage });




// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Check if the provided username and password match the adminUser
  if (username === adminUser.username && password === adminUser.password) {
    req.session.isAuthenticated = true; // Set session flag
    res.redirect('/admin/dashboard');   // Redirect to dashboard after login
  } else {
    res.redirect('/admin/login');       // Redirect back to login if authentication fails
  }
});


// Admin Dashboard Route
// Admin Dashboard Route
// Admin Dashboard Route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const containers = await Container.find().populate('cards');
    const config = await Config.findOne();
    const swiperSlides = await SwiperSlide.find(); // Fetch existing swiper slides

    res.render('dashboard', { containers, config, swiperSlides });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});





// Create a new container
router.post('/container', ensureAuthenticated, async (req, res) => {
  try {
    const newContainer = new Container({
      title: req.body.title,
      cards: [] // Initially empty array for cards
    });

    await newContainer.save(); // Save the new container

    // Redirect to the admin dashboard after saving the container
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error logging out');
      }
      res.redirect('/admin/login');
    });
  }
});



// Create new card
router.post('/card', upload.single('image'), async (req, res) => {
  try {
    const containerId = req.body.container;
    const container = await Container.findById(containerId);

    if (!container) {
      return res.status(404).send('Container not found');
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create the new card
    const newCard = {
      title: req.body.title,
      paragraph: req.body.paragraph, // Make sure you're passing this field in the form
      linkUrl: req.body.youtubeLink, // Make sure to rename fields consistently
      imageUrl: result.secure_url,   // Use Cloudinary's secure URL
      sectionId: container._id       // Set the sectionId to the container's ID
    };

    // Push the new card to the container's cards array
    container.cards.push(newCard);

    await container.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Route to handle card deletion
router.post('/card/delete/:containerId/:cardId', async (req, res) => {
  try {
    const { containerId, cardId } = req.params;

    // Find the container and remove the card by its ID
    await Container.findByIdAndUpdate(
      containerId,
      { $pull: { cards: { _id: cardId } } }, // Use MongoDB's $pull to remove the card
      { new: true }
    );

    // Redirect to the dashboard after deletion
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).send('Server Error');
  }
});

// Route to handle container deletion
router.post('/container/delete/:id', async (req, res) => {
  try {
    const containerId = req.params.id;

    // Find and delete the container by its ID
    await Container.findByIdAndDelete(containerId);

    // Redirect to the dashboard after deletion
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting container:', err);
    res.status(500).send('Server Error');
  }
});


// Route to add a new swiper-slide with an anchor link
router.post('/swiper/add', upload.single('image'), async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create a new swiper-slide with the uploaded image URL and anchor URL
    const newSlide = new SwiperSlide({
      imageUrl: result.secure_url,
      anchorUrl: req.body.anchorUrl  // Get the URL from the form
    });

    await newSlide.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding swiper slide:', err);
    res.status(500).send('Server Error');
  }
});


// Route to delete a swiper-slide
// Route to delete a swiper-slide
router.post('/swiper/delete/:id', async (req, res) => {
  try {
    await SwiperSlide.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting swiper slide:', err);
    res.status(500).send('Server Error');
  }
});



// Route for logging out
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/admin/login');
  });
});


module.exports = router;
