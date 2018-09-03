const express = require('express');
const path = require('path');
let app = express();
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const Strategy = require('passport-google-oauth20').Strategy; // a 'strategy' to use for passport
// const path = require('path');
// const fs = require('fs');
// const port = process.env.PORT || 3000;
// // const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// // const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let number = [];
    for (let i = 0; i < 100; i++){
         number.push({index: i});

    }
    res.render('index', {number,
        date: new Date(),
        list: ['apple', 'orange', 'peach']
    })
});
app.get('/fruits/:fruitName', (req, res) => {
    res.end(`you clicked on ${req.params.fruitName}`)
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});