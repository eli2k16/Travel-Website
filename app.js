const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');

const app = express();

// MySQL database connection (initialize once)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ehardin8',
  database: 'travel_website',
});

// Connect to MySQL once on server start
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit process if database connection fails
  }
  console.log('Connected to MySQL database');
});

const bodyParser = require('body-parser');
// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Set up static files and views
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Define a route for Porto
app.get('/porto', (req, res) => {
  res.render('porto'); // Render the porto.ejs page
});

// Define a route for Tokyo
app.get('/tokyo', (req, res) => {
  res.render('tokyo'); // Render the tokyo.ejs page
});

// Define a route for Nairobi
app.get('/nairobi', (req, res) => {
  res.render('nairobi'); // Render the nairobi.ejs page
});

// Define a route for Mauritius
app.get('/mauritius', (req, res) => {
  res.render('mauritius'); // Render the maritius.ejs page
});

// Define a route for Masai Mara
app.get('/masai_mara', (req, res) => {
  res.render('masai_mara'); // Render the masai_mara.ejs page
});

// Define a route for Interlaken
app.get('/interlaken', (req, res) => {
  res.render('interlaken'); // Render the interlaken.ejs page
});

// Define a route for Giza
app.get('/giza', (req, res) => {
  res.render('giza'); // Render the giza.ejs page
});

// Define a route for Dubai
app.get('/dubai', (req, res) => {
  res.render('dubai'); // Render the dubai.ejs page
});

// Home page
app.get('/', (req, res) => {
  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('home', { user: req.session.user || null, destinations: results });
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length > 0) {
      req.session.user = results[0]; // Save user in session
      return res.redirect('/profile');
    }
    // If login fails, pass an error to the view
    res.render('login', { error: 'Invalid email or password' });
  });
});

// Signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);  // Log the body to see if 'name', 'email', and 'password' are correct

  // Ensure the form values are being correctly captured
  if (!name || !email || !password) {
    return res.status(400).send('Name, email, and password are required!');
  }

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err) => {
    if (err) {
      console.error('Error during signup:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/login'); // Redirect to login after successful signup
  });
});

// Profile page (requires login)
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.session.user });
});

// CRUD operations for destinations
app.get('/crud', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('crud', { destinations: results });
  });
});

app.post('/add-destination', (req, res) => {
  const { title, description, image_url } = req.body;

  db.query('INSERT INTO destinations (name, description, image_url) VALUES (?, ?, ?)', [title, description, image_url], (err) => {
    if (err) {
      console.error('Error adding destination:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/crud');
  });
});

// Handle updating a destination
app.post('/update-destination/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;

  db.query(
    'UPDATE destinations SET name = ?, description = ?, image_url = ? WHERE id = ?',
    [title, description, image_url, id],
    (err) => {
      if (err) {
        console.error('Error updating destination:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/crud');
    }
  );
});

// Handle deleting a destination
app.post('/delete-destination/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM destinations WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting destination:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/crud');
  });
});

// Booking page
app.get('/booking', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('booking', { destinations: results });
  });
});

app.post('/booking', (req, res) => {
  const { destination_id, booking_date } = req.body;
  const user_id = req.session.user.id;

  db.query('INSERT INTO bookings (user_id, destination_id, booking_date) VALUES (?, ?, ?)', [user_id, destination_id, booking_date], (err) => {
    if (err) {
      console.error('Error during booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/profile');
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
