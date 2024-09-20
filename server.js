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

app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 