const express = require('express');
const path = require('path');
let app = express();
const fs = require('fs');

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

const port = process.env.PORT || 3000;

let myJsonArray = {
    users: []
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let number = [];
    for (let i = 0; i < 100; i++){
        number.push({index: i});
    }
    res.render('index', {number,
        title: 'Welcome!',
        // date: new Date(),
        // list: ['apple', 'orange', 'peach']
    })
});
app.use(cookieParser());
app.use('/', express.static(__dirname + '/public'));

// app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // use for JSON
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// app.use(bodyParser.urlencoded({extended: true}));
app.post('/savedUsers', (req, res) => {
        // console.log('name', req.body.username, 'password', req.body.password, 'email', req.body.email, 'age', req.body.age);
        // res.send('the name you typed is ' + req.body.username + '. You typed ' + req.body.password);
        // // res.sendFile(userFile);
        // // res.sendfile(session({}), req.body.username, (req, res) => {
        //     console.log(req.body.username)
    let cName = req.body.username;
    let cPassword = req.body.password;
    let cEmail = req.body.email;
    let cAge = req.body.age;

    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let index = 0;
        let pData = JSON.parse(data);
        console.log(pData);
        let myDataObject = {
            id: 0,
            name: cName,
            password: cPassword,
            email: cEmail,
            age: cAge
        };
        pData.users.forEach(client => {
            if (client.id === index) index++;
            myJsonArray.users.push(client)
        });
        myDataObject.id = index;
        myJsonArray.users.push(myDataObject);
        console.log(myDataObject);
        fs.writeFile(userFile, JSON.stringify(myJsonArray),'utf8', (err) => {
            if (err) console.log(err);
        });
    });
    res.sendFile(userFile);
    // res.redirect('/userlistingview');


});

app.listen(3000, () => {
    console.log('listening on port 3000');
});