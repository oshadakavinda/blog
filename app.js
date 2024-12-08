require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for static files
app.use(express.static('public'));

// Templating engine
app.use(expressLayout);
app.set('layout', 'layouts/main'); // Set default layout
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Routes
app.use('/', require('./server/routes/main'));

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
