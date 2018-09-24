const express = require('express');
const path = require('path');
let app = express();
const fs = require('fs');


const userFile = __dirname + '/user.json';

const bodyParser = require('body-parser'); // be able to parse form elements

const cookieParser = require('cookie-parser');



let users = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let number = [];
    for (let i = 0; i < 150; i++){
        number.push({index: i});
    }
    res.render('index', {number,
        title: 'Welcome!',
    })
});
app.use(cookieParser());
app.use('/', express.static(__dirname + '/public'));

// app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // use for JSON


app.post('/savedUsers', (req, res) => {

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
        //read and parse json file
        fs.readFile('user.json', 'utf8', (err, data) => {
            if (err) throw err;
            let parsedDataIntoJson = JSON.parse(data);
            //new object with users added to my data
            parsedDataIntoJson.users.push(myReqToObject);

        fs.writeFile(userFile, JSON.stringify(parsedDataIntoJson), 'utf8', (err) => {
            if (err) console.log(err)
        })
    });
    res.redirect('/userlistingview');
});


app.post('/editUsersForm', (req, res) => {
    //open file
    fs.readFile(userFile, 'utf8', (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        let user;
        for (let i = 0; i < parsedData.users.length; i++) {
            let id = req.body.id;
            if( parsedData.users[i].id === id) {
                user = parsedData.users.splice(i, 1)[0];
                user.name = req.body.username;
                user.email = req.body.email;
                user.password = req.body.password;
                user.age = req.body.age;
                break;
            }
        }
        console.log('second try with user', user);
        if (!user) {
            res.send('user is not defined');
            console.log('user in if statmemt', user)
        }
        else {
            console.log('user in else statmemt:', user);

            parsedData.users.push(user);
            fs.writeFile(userFile, JSON.stringify(parsedData), 'utf8', (err) => {
                if (err) console.log(err)
            })
        }

    });
    res.redirect('/userlistingview');
});


app.get('/editUser', (req, res) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);

        let id = req.query.id;
        let user;
        for(let i = 0; i < parsedData.users.length; i++){
            if (parsedData.users[i].id === id){
               user = parsedData.users[i];
            }
        }
        if(user === null){
            res.send('Must pass a user!');
        }
        res.render('editUser', {user: user});


    });

});

app.get('/userlistingview', (req, res) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        res.render('table', {users: parsedData.users})
    });
});

app.get('/delete', (req, res) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
        let id = req.query.id;

        if (err) throw err;
        let parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.users.length; i++) {
            if( parsedData.users[i].id === id) {
                parsedData.users.splice(i, 1);
                break;
            }
        }
        fs.writeFile(userFile, JSON.stringify(parsedData), 'utf8', (err) => {
            if (err) console.log(err)
        })
    });

    //http://localhost:3000/delete?id=something
    // res.end("I have received the ID: " + id);
    res.redirect('/userlistingview');
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});