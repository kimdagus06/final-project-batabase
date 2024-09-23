const express = require("express");
const sqlite3 = require("sqlite3");
const path = require('path');
const bcrypt = require('bcrypt'); // For hasing password 
const { engine } = require("express-handlebars");

const app = express();
const dbFile = "data.sqlite3.db";
const db = new sqlite3.Database(dbFile);
const port = 3030;

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

// Create a table
/**
 * NOT NULL: Can't have a NULL value. So it can't be left empty.
 * UNIQUE: All values in a column are distinct from each other. So no two users can have the same email address.
 */
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            date_of_birth TEXT NOT NULL,
            password TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
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
    next (); 
}); 

// https://coda.io/@peter-sigurdson/lab-workbook-setting-up-a-node-js-express-server-with-sqlite-and
https://www.luisllamas.es/en/how-to-use-sqlite-with-nodejs/

// Routers 
app.get("/", function (req, res) {
    res.render("home"); 
});

app.get("/createaccount", function (req, res) {
    res.render("createaccount"); 
});

app.get("/login", function (req, res) {
    res.render("login"); 
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

/**
 * Hash Passwords with bcrypt in Node.js
 * https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
 */

// // It's not necessary to hash all information because recovering data can be difficult in the event of a hack. 
// Just hashing the password is sufficient.

// node ./bcrypt-demo.js
// getSalt method

app.post("/create-account", async (req, res) => {
    const { first_name, last_name, email, date_of_birth, password } = req.body;

    try {
        // Hash the password before saving to the database
        const hash = await bcrypt.hash(password, 14); 

        const sql = `INSERT INTO users (first_name, last_name, email, date_of_birth, password) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [first_name, last_name, email, date_of_birth, hash], (err) => {
            if (err) {
                return res.status(500).send("Server error: " + err.message);
            }
            res.redirect("/main");
        });
    } catch (err) {
        return res.status(500).send("Error hashing password: " + err.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            res.status(500).send('Server error');
        } else if (!user) {
            res.status(401).send('User not found');
        } else {
            
    const result = await bcrypt.compare(password, user.password);
    
    if (result) {
        req.session.user = user; // Store the user in the session
        res.redirect('/'); // Redirect to the home page
        } else {
            res.status(401).send('Wrong password');
        }
    }
});
});

/* Start a port */
app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 