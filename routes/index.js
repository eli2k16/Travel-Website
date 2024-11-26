const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');

const router = express.Router(); // Use Router instead of app

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ehardin8',
  database: 'travel_website',
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Middleware for sessions
router.use(session({
  secret: 'your_secret_key', // Replace with a secret key for sessions
  resave: false,
  saveUninitialized: true,
}));

// Home page
router.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST request
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE name = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.redirect('/login');
    }
    if (results.length > 0) {
      req.session.user = results[0];
      return res.redirect('/profile');
    }
    return res.redirect('/login');
  });
});

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle signup POST request
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  db.query('INSERT INTO users (name, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }
    return res.redirect('/login');
  });
});

// Profile page
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.session.user });
});

// CRUD for managing destinations
router.get('/crud', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    res.render('crud', { destinations: results });
  });
});

router.post('/add-destination', (req, res) => {
  const { title, description, image_url } = req.body;

  db.query('INSERT INTO destinations (name, description, image_url) VALUES (?, ?, ?)', [title, description, image_url], (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/crud');
    }
    return res.redirect('/crud');
  });
});

router.post('/update-destination/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;

  db.query('UPDATE destinations SET name = ?, description = ?, image_url = ? WHERE id = ?', [title, description, image_url, id], (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/crud');
    }
    return res.redirect('/crud');
  });
});

router.post('/delete-destination/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM destinations WHERE id = ?', [id], (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/crud');
    }
    return res.redirect('/crud');
  });
});

// Booking page
router.get('/booking', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    res.render('booking', { destinations: results });
  });
});

router.post('/booking', (req, res) => {
  const { destination_id, booking_date } = req.body;
  const user_id = req.session.user.id;

  db.query('INSERT INTO bookings (user_id, destination_id, booking_date) VALUES (?, ?, ?)', [user_id, destination_id, booking_date], (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/booking');
    }
    return res.redirect('/profile');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

module.exports = router;
