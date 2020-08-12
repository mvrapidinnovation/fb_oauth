const express = require('express');
const app = express();
const ngrok = require('ngrok');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const user = require('./model');

mongoose.connect('mongodb://localhost:27017/oauthDemo');

app.use(bodyParser.json());
app.use('/', express.static('public'));

// route to authorize, login and register the user
app.post('/login-facebook', async (req, res) => {
    const { accessToken, userID } = req.body;

    const respond = await fetch(`https://graph.facebook.com/v8.0/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`)
    const json = await respond.json();

    // Verify the user ID
    if(json.id === userID) {

        // check if user exists in DB then login else register then login
        const resDB = await user.findOne({ facebookID: userID });

        if(resDB) {
            // user is registered
            res.json({ status: 'ok', message: 'You are logged in' });
        } else {

            // in-case user is not in database.
            const person = new user({
                name: 'User',
                facebookID: userID,
                accessToken
            });
            await person.save();
        
            res.json({ status: 'ok', message: 'You are registered and logged in' });
        }

    } else {
        // send a warning
        res.json({ status: 'error', message: 'Ha, Gotchya!' });
    }

});

app.listen(8080, () => {
    console.log('Server started at port 8080');

    // used ngrok because FB required secure HTTP
    (async function() {
        const url = await ngrok.connect(8080);
        console.log(`Publicly accessible at ${url}`)
    })();

});