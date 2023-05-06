const express = require('express');
const app = new express();
const router = require('./routes/healthappRoutes');
const path = require('path');
const mustache = require('mustache-express');
require('dotenv').config();


app.use(express.urlencoded({extended: true}))
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use('/', router);

app.listen(3000, () => {
    console.log("Server Started on port", 3000);
})