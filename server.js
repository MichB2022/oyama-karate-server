const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');

const errorHandler = require('./middleware/error');

// Start functions - essential
// const connectDB = require('./config/dbConfig');
const app = express();

// Security imports
// Enable CORS
// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     optionsSuccessStatus: 200
//   })
// );

var whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://oyama-karate-next-ka8lz685b-jpisula.vercel.app'
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

app.use(cors(corsOptions));

// Load env vars
dotenv.config({ path: 'config/config.env' });

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const homepageR = require('./routes/homepageR.js');
const articlesR = require('./routes/articlesR.js');
const categoriesR = require('./routes/categoriesR.js');
const sectionsR = require('./routes/sectionsR.js');
const sectionsGroupR = require('./routes/sectionsGroupR.js');
const scheduleR = require('./routes/scheduleR.js');
const preschoolersR = require('./routes/preschoolersR.js');
const eventCategoryR = require('./routes/eventCategoryR.js');
const calendarR = require('./routes/calendarR.js');
const infoPageR = require('./routes/infoPageR.js');
const instructorR = require('./routes/instructorR.js');
const imagesR = require('./routes/imagesR.js');
const galeriesR = require('./routes/galeriesR.js');
const motivationR = require('./routes/motivationR.js');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/homepage', homepageR);
app.use('/api/v1/articles', articlesR);
app.use('/api/v1/categories', categoriesR);
app.use('/api/v1/sections', sectionsR);
app.use('/api/v1/sectionsgroup', sectionsGroupR);
app.use('/api/v1/schedule', scheduleR);
app.use('/api/v1/preschooler', preschoolersR);
app.use('/api/v1/eventcategories', eventCategoryR);
app.use('/api/v1/infopages', infoPageR);
app.use('/api/v1/calendar', calendarR);
app.use('/api/v1/instructors', instructorR);
app.use('/api/v1/images', imagesR);
app.use('/api/v1/galery', galeriesR);
app.use('/api/v1/motivation', motivationR);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promis rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);

  // Close server & exit process
  server.close(() => process.exit(1));
});
