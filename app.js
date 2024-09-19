  const { render } = require("ejs");
  const bodyParser = require('body-parser');
  const nodemailer = require('nodemailer');
  const express = require("express");
  const app = express();
  const path = require("path");
  require('dotenv').config();
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.static(path.join(__dirname, "/public")));
  const session = require('express-session');
  const router = express.Router();
  const Container = require('./models/Container'); // Adjust the path as per your project structure
  const Config = require('./models/Config'); // Adjust the path if needed
  const SwiperSlide = require('./models/SwiperSlide'); // Add this if not already imported
  // Use the admin routes
  const adminRoutes = require('./routes/admin'); // Adjust the path if necessary
  app.use('/admin', adminRoutes);
  const MongoStore = require('connect-mongo');
  // To parse form data (application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: true }));
  
  // To parse JSON data
  app.use(express.json());
  
  // Session middleware for login
  app.use(session({
    secret:  process.env.SECREAT, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } ,// Set secure: true if using HTTPS
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
  }));
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Route to handle form submission
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body
  
    // Set up the email transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_FROM_EMAIL, // Your Gmail address
        pass: process.env.NODE_MAILER , // Your Gmail password (or app password)
      },
    });

   // Email options
   let mailOptions = {
    from: email,
    to: process.env.USER_TO_EMAIL, // Your Gmail address
    subject: 'New message from website contact form',
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };   

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Email sent successfully');
        }
      });
    });


app.get("/home", async (req, res) => {
   res.render("./home.ejs")
})

// the new code starts here


const multer = require('multer');

// Configure Multer storage to control file naming and destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload folder
  },
  filename: (req, file, cb) => {
    // Use a unique filename (timestamp + original file extension)
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Configure Multer upload with file size limit (e.g., 5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Accept only image files (jpeg, png, etc.)
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.post('/card', upload.single('image'), async (req, res) => {
  // Handle image upload and card creation logic here
});


let containers = [
  {
    id: 1,
    title: 'Container 1',
    cards: [
      { id: 1, title: 'Card 1', image: 'cloudinary_url_1', youtubeLink: 'https://youtube.com/...' },
      { id: 2, title: 'Card 2', image: 'cloudinary_url_2', youtubeLink: 'https://youtube.com/...' }
    ]
  }
];

app.get('/work', async (req, res) => {
  try {
    // Fetch all containers and their associated cards from the database
    const containers = await Container.find();

    // Fetch iframe config from the database
    const config = await Config.findOne();

   // Fetch swiper slides from the database
   const swiperSlides = await SwiperSlide.find(); // Get all the swiper slides

    // Render the work.ejs template and pass the containers, config, and iframes
    res.render('work', { containers, config, swiperSlides });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Catch-all route for non-existent pages (404)
app.use((req, res, next) => {
  res.status(404).render('404'); // Render the 404.ejs template
});




app.listen(8080, () => {
    console.log("listening to port 8080")
})