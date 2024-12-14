require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));
// Middleware for static files
app.use(express.static('public'));

// Templating engine
app.use(expressLayout);
app.set('layout', 'layouts/main'); // Set default layout
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
