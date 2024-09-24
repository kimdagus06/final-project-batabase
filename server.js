const express = require("express");
const sqlite3 = require("sqlite3");
const path = require('path');
const bcrypt = require('bcrypt'); // For hasing password 
const { engine } = require("express-handlebars");

const app = express();
const dbFile = "data.sqlite3.db";
const db = new sqlite3.Database(dbFile);
const port = 3333;
const session = require('express-session');

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Express middlewares
app.use(express.urlencoded({ extended: true })); // url passing
app.use(express.json());
app.use(session({
    secret: 'your-secret-key', // Use a strong secret
    resave: false,
    saveUninitialized: true,
}));

/**
 * NOT NULL: Can't have a NULL value. So it can't be left empty.
 * UNIQUE: All values in a column are distinct from each other. So no two users can have the same email address.
 * 
 * Table one | Create Account 
 */
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Users table created successfully.");
        }
    });
});

/**
 * NOT NULL: Can't have a NULL value. So it can't be left empty.
 * UNIQUE: All values in a column are distinct from each other. So no two users can have the same email address.
 * 
 * Table two | Create Hangouts (events) 
 */
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventName TEXT NOT NULL,
            eventType TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            eventFormat TEXT NOT NULL,
            address TEXT NOT NULL,
            postcode TEXT
        );
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Hangouts table created successfully.");
        }
    });
});

/**
 * Session middleware
 * Update the session middleware to store the user in the session 
 */
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next(); 
}); 

// https://coda.io/@peter-sigurdson/lab-workbook-setting-up-a-node-js-express-server-with-sqlite-and
// https://www.luisllamas.es/en/how-to-use-sqlite-with-nodejs/

// Routes 
app.get("/", function (req, res) {
    res.render("home"); 
});

app.get("/createaccount", function (req, res) {
    res.render("createaccount"); 
});

app.get("/login", function (req, res) {
    res.render("login"); 
});

app.get("/logout", function (req, res) {
    res.render("logout"); 
});

app.get("/about", function (req, res) {
    res.render("about"); 
});

app.get("/contact", function (req, res) {
    res.render("contact"); 
});

app.get("/events", function (req, res) {
    res.render("events"); 
});

app.get("/upcominghangouts", function (req, res) {
    res.render("upcominghangouts"); 
});

/**
 * Create Account
 * 
 * Hash Passwords with bcrypt in Node.js
 * https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
 * 
 * It's not necessary to hash all information because recovering data can be difficult in the event of a hack. 
 * Just hashing the password is sufficient.
 */
app.post('/create-account', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 14);

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                console.error('Error inserting user:', err.message); // Print out an error message 
                return res.status(500).send('Server error');
            }

            console.log("New account has been created."); 

            // Redirect after a use create a new account
            res.redirect('/');
        });

    } catch (err) {
        console.error('Error hashing password:', err.message); // Print out a hash error message 
        return res.status(500).send('Error hashing password');
    }
});

/**
 * Log in 
 * This code is from 5-authentication-slides.pdf 
 */
app.post('/login-hangouts', async (req, res) => {
    const { username, password } = req.body;
    
    // Find the user in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            res.status(500).send('Server error');
        } else if (!user) {
            res.status(401).send('User not found');
        } else {
            
    const result = await bcrypt.compare(password, user.password);

    if (result) {
        console.log("Sucessfully log in.");
        req.session.user = user; // Store the user in the session
        res.redirect('/'); // Redirect to the home page
        } else {
            res.status(401).send('Wrong password');
        }
    }});
});

/**
 * Hangout (Event create)
 */
app.post('/create-hangout', async (req, res) => {
    const { eventName, eventType, startTime, endTime, eventFormat, address, postcode } = req.body;
    
    db.run('INSERT INTO events (eventName, eventType, startTime, endTime, eventFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [eventName, eventType, startTime, endTime, eventFormat, address, postcode], (err) => {
        if (err) {
            console.error('Error inserting event:', err.message); // Print out an error message 
            return res.status(500).send('Server error');
        }

        console.log("New event has been created."); 

        // Redirect after creating a new event 
        res.redirect('/events');
    });
});

/* Start a port */
app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 