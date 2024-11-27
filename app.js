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

  // Define a route for Destinations
  app.get('/destinations', (req, res) => {
    res.render('destinations'); // Render the destinations.ejs page
});

// Profile page (requires login)
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.session.user });
});

// CRUD operations for bookings
app.get('/crud', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('crud', { bookings: results });
  });
});

// Add a new booking
app.post('/add-booking', (req, res) => {
  const { customer_name, location, booking_date } = req.body;

  db.query('INSERT INTO bookings (customer_name, location, booking_date) VALUES (?, ?, ?)', [customer_name, location, booking_date], (err) => {
    if (err) {
      console.error('Error adding booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/crud');
  });
});

// Edit an existing booking (directly from crud.ejs)
app.post('/edit-booking/:id', (req, res) => {
  const { id } = req.params;
  const { customer_name, location, booking_date } = req.body;

  db.query('UPDATE bookings SET customer_name = ?, location = ?, booking_date = ? WHERE id = ?', [customer_name, location, booking_date, id], (err) => {
    if (err) {
      console.error('Error updating booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/crud');
  });
});

// Delete (cancel) a booking
app.post('/delete-booking/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM bookings WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/crud');
  });
});





// Route to show all bookings and allow booking new destinations
app.get('/booking', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Fetch user's bookings
    const user_id = req.session.user.id;
    db.query(
      'SELECT b.id, d.name AS destination_name, b.booking_date FROM bookings b JOIN destinations d ON b.destination_id = d.id WHERE b.user_id = ?',
      [user_id],
      (err, bookings) => {
        if (err) {
          console.error('Error fetching bookings:', err);
          return res.status(500).send('Internal Server Error');
        }

        // Render booking page with user, destinations, and bookings data
        res.render('booking', {
          user: req.session.user, // Current user
          destinations: results,  // List of destinations
          bookings: bookings      // User's bookings
        });
      }
    );
  });
});

// Route to handle new bookings
app.post('/booking', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { destination_id, booking_date } = req.body;
  const user_id = req.session.user.id;

  // Insert new booking into the database
  db.query('INSERT INTO bookings (user_id, destination_id, booking_date) VALUES (?, ?, ?)', [user_id, destination_id, booking_date], (err, result) => {
    if (err) {
      console.error('Error creating new booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/booking');
  });
});

// Route to handle canceling bookings
app.post('/cancel-booking/:id', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const booking_id = req.params.id;

  // Delete booking from the database
  db.query('DELETE FROM bookings WHERE id = ?', [booking_id], (err, result) => {
    if (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/booking');
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
