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

// https://coda.io/@peter-sigurdson/lab-workbook-setting-up-a-node-js-express-server-with-sqlite-and
https://www.luisllamas.es/en/how-to-use-sqlite-with-nodejs/

// Routers 
app.get("/", function (req, res) {
    res.render("home"); 
});

app.get("/createaccount", function (req, res) {
    res.render("createaccount"); 
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
// Handle account creation
app.post("/create-account", (req, res) => {
    const { first_name, last_name, email, date_of_birth, password } = req.body;

    // Hash the password before saving to the database
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send("Error hashing password: " + err.message);
        }

        const sql = `INSERT INTO users (first_name, last_name, email, date_of_birth, password) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [first_name, last_name, email, date_of_birth, hash], (err) => {
            if (err) {
                return res.status(500).send("Error creating account: " + err.message);
            }
            res.redirect("/");
        });
    });
});

/* Start a port */
app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 