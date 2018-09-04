const express = require('express');
const path = require('path');
let app = express();
const session = require('express-session');
const uuid = require('uuid/v4')
const userFile = __dirname + '/user.json';

const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser'); // be able to parse form elements

const cookieParser = require('cookie-parser');
const passport = require('passport');
// const Strategy = require('passport-google-oauth20').Strategy; // a 'strategy' to use for passport
const LocalStrategy = require('passport-local').Strategy; // a 'strategy' to use for passport

// const path = require('path');
// const fs = require('fs');
const port = process.env.PORT || 3000;
// // const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// // const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const users = [
    {id: 0, username: 'jason', password: 'abc', email: 'jason@example.com'},
    {id: 1, username: 'kate', password: '123', email: 'kate@example.com'}
];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let number = [];
    for (let i = 0; i < 100; i++){
        number.push({index: i});
    }
    res.render('index', {number,
        title: 'Welcome!',
        date: new Date(),
        list: ['apple', 'orange', 'peach']
    })
});
app.use(cookieParser());
app.use('/', express.static(__dirname + '/public'));

// app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // use for JSON
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended:false})); //handle body requests
app.use(bodyParser.json()); // let's make JSON work too!

// app.use(bodyParser.urlencoded({extended: true}));
app.post('/savedUsers', (req, res) => {
        console.log('name', req.body.username, 'password', req.body.password, 'email', req.body.email, 'age', req.body.age);
        res.send('the name you typed is ' + req.body.username + '. You typed ' + req.body.password);
        // res.sendFile(userFile);
        // res.sendfile(session({}), req.body.username, (req, res) => {
            console.log(req.body.username)
        // res.redirect('/userlistingview');

    }

);
app.post('/userlistingview', (req, res) => {
    // res.send(userFile)
    console.log('name', req.body.username, 'password', req.body.password, 'email', req.body.email, 'age', req.body.age);

    res.send(req.body.username)
});
app.use(passport.initialize());
app.use(passport.session());


app.listen(3000, () => {
    console.log('listening on port 3000');
});