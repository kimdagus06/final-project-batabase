const express = require(express);
const path = require('path');
const app = express(); 
const port = 3000; 

const userName = '';

app.use(express.static(path.join(__dirname, 'public'))); 

/* https://stackoverflow.com/questions/62092010/use-nodejs-to-change-what-text-html-displays */

app.get('/', (req, res) =>{
    res.render('home');
});

app.get('/', (req, res) =>{
    res.render('events');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})