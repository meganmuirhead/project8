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

let users = [];

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

app.post('/savedUsers', (req, res) => {
        console.log('name', req.body.username, 'password', req.body.password, 'email', req.body.email, 'age', req.body.age);
        // res.send('the name you typed is ' + req.body.username + '. You typed ' + req.body.password);

            console.log(req.body.username)
        let objectName = req.body.username;
        let objectPassword = req.body.password;
        let objectEmail = req.body.email;
        let objectAge = req.body.age;

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
        let objectId = uuidv4();

        let myReqToObject = {
            name: objectName,
            password: objectPassword,
            email: objectEmail,
            age: objectAge,
            id: objectId
        };
        users.push(myReqToObject);
        console.log(users);
        //read and parse json file
        fs.readFile('user.json', 'utf8', (err, data) => {
            if (err) throw err;
            console.log('data:', data)
            let parsedDataIntoJson = JSON.parse(data);
            console.log('parsed', parsedDataIntoJson);
            //new object with users added to my data
            parsedDataIntoJson.users.push(users);

        fs.writeFile(userFile, JSON.stringify(parsedDataIntoJson), 'utf8', (err) => {
            if (err) console.log(err)
        })
            //get each user to have a unique idea

            //serialize this thing, and over write to the file

        });
    res.redirect('/userlistingview');
});
app.get('/userlistingview', (req, res) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('data', data);
        res.send(data);

    });
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});