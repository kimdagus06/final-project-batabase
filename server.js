const express = require("express");
const sqlite3 = require("sqlite3");
const path = require('path');
const app = express(); 
app.use(express.static("public")); 
const { engine } = require("express-handlebars");
const dbFile = "data.sqlite3.db"; 
db = new sqlite3.Database(dbFile); 
const port = 3030; 

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const userName = '';


app.use(express.static(path.join(__dirname, 'public'))); 

/* https://stackoverflow.com/questions/62092010/use-nodejs-to-change-what-text-html-displays */

app.get("/", function (req, res) {
    res.render("home.handlebars"); 
}); 

app.get("/contact", function (req, res) {
    res.render("contact.handlebars"); 
});

app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 