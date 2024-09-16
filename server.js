const express = require(express);
const path = require('path');
const app = express(); 
const port = 3000; 

const userName = '';

app.use(express.static(path.join(__dirname, 'public'))); 

/* https://stackoverflow.com/questions/62092010/use-nodejs-to-change-what-text-html-displays */