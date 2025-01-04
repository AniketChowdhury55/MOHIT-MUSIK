const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { ensureAuthenticated } = require('../middlewares/auth');
const Container = require('../models/Container');
const Card = require('../models/Card');
const Config = require('../models/Config');
const Iframe = require('../models/Iframe');
const session = require('express-session');
const SwiperSlide = require('../models/SwiperSlide');
const Admin = require('../models/Admin'); // Admin model to handle password
const multer = require('multer');
const path = require('path');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECREAT,
});

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && admin.password === password) {
      req.session.isAuthenticated = true;
      return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Admin Dashboard Route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const containers = await Container.find().populate('cards');
    const config = await Config.findOne();
    const swiperSlides = await SwiperSlide.find();
    const message = req.query.message || null;

    res.render('dashboard', { containers, config, swiperSlides, message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to render the Change Password form
router.get('/change-password', ensureAuthenticated, (req, res) => {
  res.render('change-password');
});

// Route to handle password change
router.post('/change-password', ensureAuthenticated, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const admin = await Admin.findOne();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.redirect('/admin/dashboard?message=All fields are required.');
    }

    if (admin.password !== currentPassword) {
      return res.redirect('/admin/dashboard?message=Current password is incorrect.');
    }

    if (newPassword !== confirmPassword) {
      return res.redirect('/admin/dashboard?message=New password and confirm password do not match.');
    }

    // Update the password
    admin.password = newPassword;
    await admin.save();

    req.session.destroy(err => {
      if (err) {
        console.error('Error logging out after password change:', err);
        return res.status(500).send('Error logging out after password change.');
      }
      res.redirect('/admin/login?message=Password updated successfully. Please log in again.');
    });
  } catch (err) {
    console.error('Error changing password:', err);
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

// Other Routes
router.post('/container', ensureAuthenticated, async (req, res) => {
  try {
    const newContainer = new Container({
      title: req.body.title,
      cards: [],
    });
    await newContainer.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/card', upload.single('image'), async (req, res) => {
  try {
    const containerId = req.body.container;
    const container = await Container.findById(containerId);

    if (!container) {
      return res.status(404).send('Container not found');
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const newCard = {
      title: req.body.title,
      paragraph: req.body.paragraph,
      linkUrl: req.body.youtubeLink,
      imageUrl: result.secure_url,
      sectionId: container._id,
    };

    container.cards.push(newCard);
    await container.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/card/delete/:containerId/:cardId', async (req, res) => {
  try {
    const { containerId, cardId } = req.params;
    await Container.findByIdAndUpdate(containerId, { $pull: { cards: { _id: cardId } } }, { new: true });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).send('Server Error');
  }
});

router.post('/container/delete/:id', async (req, res) => {
  try {
    const containerId = req.params.id;
    await Container.findByIdAndDelete(containerId);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting container:', err);
    res.status(500).send('Server Error');
  }
});

router.post('/swiper/add', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newSlide = new SwiperSlide({
      imageUrl: result.secure_url,
      anchorUrl: req.body.anchorUrl,
    });

    await newSlide.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding swiper slide:', err);
    res.status(500).send('Server Error');
  }
});

router.post('/swiper/delete/:id', async (req, res) => {
  try {
    await SwiperSlide.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting swiper slide:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
