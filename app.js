const express = require('express');
const app = new express();
const router = require('./routes/healthappRoutes');
const path = require('path');
const mustache = require('mustache-express');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.listen(3000, () => {
    console.log("Server Started on port", 3000);
})