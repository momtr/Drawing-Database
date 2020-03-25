const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const fs = require('fs');

// set up database
const database = new Datastore('database.db');
database.loadDatabase();

// get words from text file
let words;
fs.readFile('words.txt', 'utf8', (err, data) => {
    if(err)
        throw err;
    words = data.split("\n");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/word', (req, res) => {
    res.send(JSON.stringify({
        word: getRandomWord()
    }))
});

app.post('/saveDrawing', (req, res) => {
    // we get a drawing
    let data = req.body.data;
    let drawing = data.drawing;
    if(drawing.length > 0) {
        let drawingSize = data.drawingSize;
        let word = data.word;
        let drawingUUID = uuid(20);
        let time = data.time;
        // save drawing in db
        database.insert({
            drawingUUID, word, drawingSize, drawing, time
        });
        console.log("Hey! New drawing :) -> " + word);
        // send next word back
        res.send(JSON.stringify({
            word: getRandomWord(),
            status: 'success'
        }));
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});


function sendErrorMessage(res, code, text, el) {
    res.send({
        status: 'ERROR',
        code: code,
        text: text,
        data: {
            el: el
        }
    })
}

function uuid(length) {
    let res = "";
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for(let i = 0; i < length; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}