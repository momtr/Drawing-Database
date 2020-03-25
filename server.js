const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/contact', (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let strasse = req.body.strasse;
    let hausnummer = req.body.hausnummer;
    let postleitzahl = req.body.postleitzahl;
    let phone = req.body.phone;
    let email = req.body.email;
    if(!firstname || !lastname || !strasse || !hausnummer || !postleitzahl || !phone) 
        sendErrorMessage(res, 10001, "Bitte fülle alle Felder aus.", "*")
    else {
        // validation
        if(firstname.length <= 2)
            sendErrorMessage(res, 10002, "Bitte gib deinen echten Vornamen an, damit wir wissen, wer du bist.", "firstname");
        else if(lastname.length <= 2)
            sendErrorMessage(res, 10003, "Bitte gib deinen ehcten Nachnamen an, damit wir wissen, wer du bist.", "lastname");
        else if(strasse.length <= 3)
            sendErrorMessage(res, 10004, "Bitte gib deine Straße ein, damit wir wissen wo du wohnst und die Suche vereinfachen können.", "strasse");
        else if(isNaN(hausnummer.length) || hausnummer == 0)
            sendErrorMessage(res, 10005, "Bitte gib deine Hausnummer als Zahl and, damit wir wissen, wo du wohnst und die Suche verbessern können.");
        else if(phone <= 0 || !("" + phone).match(/\d{11}/))
            sendErrorMessage(res, 10006, "Deine Telefonnummer sollte in der Form ZZZZZZZZZZZ sein.");
        else {

            // put into DB


        }  

    } 
    
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
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
