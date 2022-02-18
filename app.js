const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(express.static(__dirname + '/libs'));
app.use(compression()); //Compress all routes
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));


//Routes
const categoriesRoutes = require('./routes/categories');
const projectsRoutes = require('./routes/projects');

const api = process.env.API_URL;
const port = process.env.PORT;



// use res.render to load up an ejs view file

// index page
app.get(`/`, function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
});


// about page
app.get(`${api}/about`, function(req, res) {
    res.render('pages/about');
});






app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/projects`, projectsRoutes);

//Database
mongoose
    .connect(

  'mongodb+srv://ariel:ahjardines123...@cluster0.taubc.mongodb.net/cuban-api?retryWrites=true&w=majority'


        , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME

    })
    .then(() => {

        console.log("🌎 Successfully connected to the database");
    })
    .catch((err) => {
        console.log('😞 Could not connect to the database. Exiting now...', err);
    });
const PORT =3000;

//Server
app.listen(PORT, () => {
    console.log(`✌server is running http://localhost:3000`);
});
