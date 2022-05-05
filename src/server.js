const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');

const errorHandler = require('../middleware/error');

// Start functions - essential
// const connectDB = require('./config/dbConfig');
const app = express();

const router = express.Router();

// Security imports
// Enable CORS
// router.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     optionsSuccessStatus: 200
//   })
// );

var whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'www.karatesilesia.pl/',
  'www.karatesilesia.pl',
  'https://www.karatesilesia.pl/',
  'https://www.karatesilesia.pl',
  'https://oyama-karate-admin.vercel.app/',
  'https://oyama-karate-admin.vercel.app',
  'https://oyama-karate-eu.vercel.app/',
  'https://oyama-karate-eu.vercel.app'
]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'device-remember-token',
    'Access-Control-Allow-Origin',
    'Origin',
    'Accept'
  ]
};

router.use(cors(corsOptions));

// Load env vars
dotenv.config({ path: 'config/config.env' });

// Body parser
router.use(express.json());

// Cookie parser
router.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  router.use(morgan('dev'));
}

// File uploading
router.use(fileupload());

// Set static folder
router.use(express.static(path.join(__dirname, 'public')));

// Route files
const auth = require('../routes/auth');
const users = require('../routes/users');
const homepageR = require('../routes/homepageR.js');
const articlesR = require('../routes/articlesR.js');
const categoriesR = require('../routes/categoriesR.js');
const sectionsR = require('../routes/sectionsR.js');
const sectionsGroupR = require('../routes/sectionsGroupR.js');
const scheduleR = require('../routes/scheduleR.js');
const preschoolersR = require('../routes/preschoolersR.js');
const eventCategoryR = require('../routes/eventCategoryR.js');
const calendarR = require('../routes/calendarR.js');
const infoPageR = require('../routes/infoPageR.js');
const instructorR = require('../routes/instructorR.js');
const imagesR = require('../routes/imagesR.js');
const galeriesR = require('../routes/galeriesR.js');
const motivationR = require('../routes/motivationR.js');
const calendarpageR = require('../routes/calendarpageR.js');

// Mount routers
router.use('/api/v1/auth', auth);
router.use('/api/v1/users', users);
router.use('/api/v1/homepage', homepageR);
router.use('/api/v1/articles', articlesR);
router.use('/api/v1/categories', categoriesR);
router.use('/api/v1/sections', sectionsR);
router.use('/api/v1/sectionsgroup', sectionsGroupR);
router.use('/api/v1/schedule', scheduleR);
router.use('/api/v1/preschooler', preschoolersR);
router.use('/api/v1/eventcategories', eventCategoryR);
router.use('/api/v1/infopages', infoPageR);
router.use('/api/v1/calendar', calendarR);
router.use('/api/v1/instructors', instructorR);
router.use('/api/v1/images', imagesR);
router.use('/api/v1/galery', galeriesR);
router.use('/api/v1/motivation', motivationR);
router.use('/api/v1/calendarpage', calendarpageR);

router.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = router.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promis rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);

  // Close server & exit process
  server.close(() => process.exit(1));
});
