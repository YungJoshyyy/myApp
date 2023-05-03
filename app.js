const express = require('express');
const app = new express();
const router = require('./controllers/healthappRoutes');


app.use('/', router);




app.listen(3000, () => {
    console.log("Server Started on port", 3000);
})