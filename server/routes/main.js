const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Post model to interact with the MongoDB database

/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
  try {
    // Metadata for the page, including title and description
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    // Pagination variables
    let perPage = 10; // Number of posts per page
    let page = req.query.page || 1; // Current page from query string, default to 1

    // Fetch posts from MongoDB, sorted by creation date in descending order
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage) // Skip posts for previous pages
      .limit(perPage) // Limit to the number of posts per page
      .exec();

    // Count total number of posts in the database
    const count = await Post.countDocuments({});

    // Determine if there is a next page
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    // Render the home page with fetched data and pagination info
    res.render('index', { 
      locals,        // Metadata
      data,          // Blog posts
      current: page, // Current page
      nextPage: hasNextPage ? nextPage : null, // Next page if available
      currentRoute: '/' // Current route for navigation
    });

  } catch (error) {
    console.log(error); // Log any errors
  }
});

/**
 * GET /post/:id
 * Post Detail Page
 */
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id; // Extract post ID from the URL

    // Find the specific post by its ID
    const data = await Post.findById({ _id: slug });

    // Metadata for the specific post
    const locals = {
      title: data.title, // Use the post title as the page title
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    
    // Render the post detail page with the specific post data
    res.render('post', { 
      locals,        // Metadata
      data,          // Post data
      currentRoute: `/post/${slug}` // Current route for navigation
    });
  } catch (error) {
    console.log(error); // Log any errors
  }
});
    
/**
 * POST /search
 * Search for Posts
 */
router.post('/search', async (req, res) => {
  try {
    // Metadata for the search page
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    // Extract the search term from the request body
    let searchTerm = req.body.searchTerm;

    // Sanitize the search term by removing special characters
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    // Query the database for posts matching the search term in title or body
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }}, // Case-insensitive search in title
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}   // Case-insensitive search in body
      ]
    });

    // Render the search results page with the matching posts
    res.render("search", {
      data,          // Search results
      locals,        // Metadata
      currentRoute: '/' // Current route for navigation
    });

  } catch (error) {
    console.log(error); // Log any errors
  }
});

/**
 * GET /about
 * About Page
 */
router.get('/about', (req, res) => {
  // Render the about page
  res.render('about', {
    currentRoute: '/about' // Current route for navigation
  });
});

module.exports = router; // Export the router to use in app.js
